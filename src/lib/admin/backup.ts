/**
 * Backup/restore orchestration: export every registered entity to CSV, bundle
 * them into a single self-describing container, and restore from either a
 * bundle or individual CSV files with FK-safe ordering, batched upserts and
 * per-row error reporting.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { parseCSVToObjects, toCSV } from "./csv";
import {
  BACKUP_ENTITIES,
  ENTITY_BY_TABLE,
  IMPORT_ORDER,
  coerceValue,
  type EntitySchema,
} from "./backup-schema";

/** Rows read per export page. */
const EXPORT_PAGE = 1000;
/** Rows written per import batch. */
const IMPORT_BATCH = 500;

const BUNDLE_HEADER = "#LIFELINK_BACKUP:v1";
const ENTITY_MARKER = "#LIFELINK_ENTITY:";
const BOM = "\uFEFF";

export type ConflictMode = "skip" | "update";

export interface RowError {
  /** 1-based CSV line number (0 = entity/batch-level error). */
  row: number;
  message: string;
}

export interface EntityImportResult {
  table: string;
  /** Rows that passed validation. */
  valid: number;
  /** Rows written to the DB (0 during a dry run). */
  inserted: number;
  /** Valid rows not written (ignored duplicates / failed batches). */
  skipped: number;
  errors: RowError[];
}

export interface ImportFile {
  name: string;
  text: string;
}

export interface ImportReport {
  dryRun: boolean;
  mode: ConflictMode;
  entities: EntityImportResult[];
  totals: { valid: number; inserted: number; skipped: number; errors: number };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/* ──────────────────────────── Export ──────────────────────────── */

/** Row count for a single table (used by the entities listing). */
export async function countEntity(
  supabase: SupabaseClient,
  table: string,
): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`Count failed for ${table}: ${error.message}`);
  return count ?? 0;
}

/**
 * Export one entity to CSV, paginating to bound memory usage.
 * Returns the CSV text (with BOM) and the number of rows exported.
 */
export async function exportEntity(
  supabase: SupabaseClient,
  schema: EntitySchema,
): Promise<{ csv: string; count: number }> {
  const rows: Record<string, unknown>[] = [];
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from(schema.table)
      .select("*")
      .order(schema.primaryKey, { ascending: true })
      .range(from, from + EXPORT_PAGE - 1);

    if (error) {
      throw new Error(`Export failed for ${schema.table}: ${error.message}`);
    }

    const batch = (data ?? []) as Record<string, unknown>[];
    rows.push(...batch);
    if (batch.length < EXPORT_PAGE) break;
    from += EXPORT_PAGE;
  }

  // Tolerate schema drift: only export columns that actually exist in the DB.
  // A deployed table may lack a column present in the migrations (e.g. a legacy
  // `registrations.passport_url`); emitting it would break re-import.
  const columns =
    rows.length > 0
      ? schema.columns.filter((c) => c in rows[0])
      : schema.columns;

  return { csv: toCSV(rows, columns), count: rows.length };
}

/** Combine per-entity CSVs into a single self-describing backup container. */
export function buildBundle(files: { table: string; csv: string }[]): string {
  const parts: string[] = [BUNDLE_HEADER];
  for (const f of files) {
    parts.push(`${ENTITY_MARKER}${f.table}`);
    parts.push(f.csv.replace(new RegExp(`^${BOM}`), "").replace(/\s+$/, ""));
  }
  return BOM + parts.join("\n") + "\n";
}

/** True when the text looks like a bundled backup rather than a single CSV. */
export function isBundleText(text: string): boolean {
  const input = text.replace(new RegExp(`^${BOM}`), "");
  return input.startsWith("#LIFELINK_BACKUP") || input.includes(ENTITY_MARKER);
}

/** Split a bundle back into per-entity CSV blocks. */
export function parseBundle(text: string): { table: string; csv: string }[] {
  const input = text.replace(new RegExp(`^${BOM}`), "");
  const lines = input.split(/\r?\n/);
  const result: { table: string; csv: string }[] = [];
  let current: { table: string; lines: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith(ENTITY_MARKER)) {
      if (current) {
        result.push({ table: current.table, csv: current.lines.join("\n") });
      }
      current = { table: line.slice(ENTITY_MARKER.length).trim(), lines: [] };
    } else if (line.startsWith("#LIFELINK_BACKUP")) {
      // version header — ignore
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) {
    result.push({ table: current.table, csv: current.lines.join("\n") });
  }
  return result;
}

/** Infer the target table from an individual CSV filename. */
function inferTableFromName(name: string): string | null {
  const base = (name.replace(/\\/g, "/").split("/").pop() ?? name).trim();
  const withoutExt = base.replace(/\.(csv|txt|lifelink)$/i, "");
  const match = BACKUP_ENTITIES.find(
    (e) => e.table.toLowerCase() === withoutExt.toLowerCase(),
  );
  return match?.table ?? null;
}

/* ──────────────────────────── Import ──────────────────────────── */

interface PreparedRows {
  prepared: Record<string, unknown>[];
  errors: RowError[];
}

/** Coerce every CSV row into a typed record, collecting per-row errors. */
function prepareRows(
  schema: EntitySchema,
  rows: Record<string, string>[],
): PreparedRows {
  const prepared: Record<string, unknown>[] = [];
  const errors: RowError[] = [];

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const record: Record<string, unknown> = {};
    let failed = false;

    for (const col of schema.columns) {
      const type = schema.types[col];
      const nullable = schema.nullable.includes(col);
      try {
        record[col] = coerceValue(raw[col] ?? "", type, nullable);
      } catch (err) {
        errors.push({ row: i + 2, message: `${col}: ${(err as Error).message}` });
        failed = true;
        break;
      }
    }

    if (!failed) prepared.push(record);
  }

  return { prepared, errors };
}

/**
 * Upsert a batch, self-healing against schema drift. If PostgREST reports
 * "Could not find the '<col>' column" (the live table lacks a column that the
 * migrations define), that column is stripped from every record and the batch
 * is retried, so one drifted column cannot fail the whole restore.
 */
async function upsertRows(
  supabase: SupabaseClient,
  table: string,
  records: Record<string, unknown>[],
  opts: { onConflict: string; ignoreDuplicates: boolean },
  selectCol?: string,
): Promise<{ data: unknown[] | null; error: { message: string } | null }> {
  let current = records;

  for (let attempt = 0; attempt < 6; attempt++) {
    const base = supabase.from(table).upsert(current, opts);
    const response: { data: unknown; error: { message: string } | null } =
      selectCol ? await base.select(selectCol) : await base;

    const error = response.error;
    if (!error) {
      return { data: (response.data as unknown[]) ?? null, error: null };
    }

    const match = error.message.match(/Could not find the '([^']+)' column/);
    if (match) {
      const bad = match[1].split(".").pop() as string;
      if (bad && current.length > 0 && bad in current[0]) {
        current = current.map((r) => {
          const copy = { ...r };
          delete copy[bad];
          return copy;
        });
        continue;
      }
    }
    return { data: null, error: { message: error.message } };
  }

  return { data: null, error: { message: "Upsert failed after retries" } };
}

/** Upsert prepared rows in batches, accumulating counts and errors. */
async function upsertBatches(
  supabase: SupabaseClient,
  schema: EntitySchema,
  rows: Record<string, unknown>[],
  mode: ConflictMode,
  result: EntityImportResult,
): Promise<void> {
  for (const [index, batch] of chunk(rows, IMPORT_BATCH).entries()) {
    const { data, error } = await upsertRows(
      supabase,
      schema.table,
      batch,
      { onConflict: schema.conflictTarget, ignoreDuplicates: mode === "skip" },
      schema.primaryKey,
    );

    if (error) {
      result.errors.push({
        row: index * IMPORT_BATCH + 2,
        message: `Batch upsert failed: ${error.message}`,
      });
      continue;
    }
    result.inserted += data?.length ?? 0;
  }
}

/**
 * Messages reference themselves via `reply_to`. Import in two passes: first
 * insert rows with `reply_to` nulled, then set `reply_to` once parents exist.
 */
async function importMessagesTwoPass(
  supabase: SupabaseClient,
  schema: EntitySchema,
  prepared: Record<string, unknown>[],
  mode: ConflictMode,
  result: EntityImportResult,
): Promise<void> {
  const pass1 = prepared.map((r) => ({ ...r, reply_to: null }));
  await upsertBatches(supabase, schema, pass1, mode, result);

  // Pass 2: re-send the FULL records (all NOT NULL columns present) so the
  // upsert can now set reply_to once every parent message exists. Sending only
  // {id, reply_to} fails because Postgres still validates the INSERT branch of
  // ON CONFLICT DO UPDATE against the sender_id/body NOT NULL constraints.
  const updates = prepared.filter((r) => r.reply_to != null && r.id != null);

  for (const batch of chunk(updates, IMPORT_BATCH)) {
    const { error } = await upsertRows(supabase, schema.table, batch, {
      onConflict: "id",
      ignoreDuplicates: false,
    });
    if (error) {
      result.errors.push({
        row: 0,
        message: `reply_to pass failed: ${error.message}`,
      });
    }
  }
}

/** Import a single entity's CSV into its table. */
export async function importEntity(
  supabase: SupabaseClient,
  schema: EntitySchema,
  csv: string,
  mode: ConflictMode,
  dryRun: boolean,
): Promise<EntityImportResult> {
  const result: EntityImportResult = {
    table: schema.table,
    valid: 0,
    inserted: 0,
    skipped: 0,
    errors: [],
  };

  const { header, rows } = parseCSVToObjects(csv);
  if (rows.length === 0) return result;

  const conflictCols = schema.conflictTarget.split(",").map((c) => c.trim());
  const missing = conflictCols.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    result.errors.push({
      row: 0,
      message: `Missing required column(s): ${missing.join(", ")}`,
    });
    return result;
  }

  const { prepared, errors } = prepareRows(schema, rows);
  result.errors.push(...errors);
  result.valid = prepared.length;

  if (dryRun || prepared.length === 0) {
    result.skipped = 0;
    return result;
  }

  if (schema.table === "lifelink_messages") {
    await importMessagesTwoPass(supabase, schema, prepared, mode, result);
  } else {
    await upsertBatches(supabase, schema, prepared, mode, result);
  }

  result.skipped = Math.max(0, result.valid - result.inserted);
  return result;
}

/**
 * Restore from a set of uploaded files (one bundle and/or many CSVs).
 * Entities are processed in FK-safe IMPORT_ORDER; unknown tables are ignored.
 */
export async function runImport(
  supabase: SupabaseClient,
  files: ImportFile[],
  mode: ConflictMode,
  dryRun: boolean,
): Promise<ImportReport> {
  const csvByTable = new Map<string, string>();

  for (const file of files) {
    if (isBundleText(file.text)) {
      for (const part of parseBundle(file.text)) {
        if (ENTITY_BY_TABLE[part.table]) {
          csvByTable.set(part.table, part.csv);
        }
      }
    } else {
      const table = inferTableFromName(file.name);
      if (table) csvByTable.set(table, file.text);
    }
  }

  const entities: EntityImportResult[] = [];
  for (const table of IMPORT_ORDER) {
    const csv = csvByTable.get(table);
    if (!csv) continue;
    const schema = ENTITY_BY_TABLE[table];
    if (!schema) continue;
    entities.push(await importEntity(supabase, schema, csv, mode, dryRun));
  }

  const totals = entities.reduce(
    (acc, e) => ({
      valid: acc.valid + e.valid,
      inserted: acc.inserted + e.inserted,
      skipped: acc.skipped + e.skipped,
      errors: acc.errors + e.errors.length,
    }),
    { valid: 0, inserted: 0, skipped: 0, errors: 0 },
  );

  return { dryRun, mode, entities, totals };
}
