import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { canCrudRole } from "@/lib/admin/roles";
import { writeAuditLog } from "@/lib/admin/audit";
import { BACKUP_ENTITIES, ENTITY_BY_TABLE } from "@/lib/admin/backup-schema";
import { buildBundle, exportEntity } from "@/lib/admin/backup";

export const runtime = "nodejs";
export const maxDuration = 60;

function fileStamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

/* ── Export application data as CSV (bundle or single entity) ── */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  if (!canCrudRole(auth.session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "bundle";
  const requested = searchParams.get("entities");

  const tables = requested
    ? requested
        .split(",")
        .map((t) => t.trim())
        .filter((t) => ENTITY_BY_TABLE[t])
    : BACKUP_ENTITIES.map((e) => e.table);

  if (tables.length === 0) {
    return NextResponse.json(
      { error: "No valid entities selected" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  try {
    const exported: { table: string; csv: string }[] = [];
    let rowCount = 0;
    for (const table of tables) {
      const { csv, count } = await exportEntity(supabase, ENTITY_BY_TABLE[table]);
      exported.push({ table, csv });
      rowCount += count;
    }

    await writeAuditLog({
      session: auth.session,
      action: "backup.export",
      entityType: "backup",
      details: { entities: tables, rowCount, format },
      ipAddress: auth.ip,
    });

    // Single-entity CSV download.
    if (format === "csv" && exported.length === 1) {
      const { table, csv } = exported[0];
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${table}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Otherwise return a single bundled backup container.
    const bundle = buildBundle(exported);
    return new Response(bundle, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="lifelink-backup-${fileStamp()}.lifelink"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
