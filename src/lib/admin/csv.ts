/**
 * Zero-dependency, RFC 4180-compliant CSV helpers.
 *
 * The existing parser in `src/app/api/admin/users/bulk/route.ts` splits the
 * text on newlines *before* parsing quotes, which corrupts any field that
 * contains an embedded newline (message bodies, FAQ answers, JSONB blobs).
 * These helpers instead walk the entire text character-by-character so quoted
 * newlines, commas and escaped quotes round-trip safely.
 */

const BOM = "\uFEFF";

/**
 * Escape a single CSV field per RFC 4180.
 * Wraps the value in double quotes when it contains a comma, quote, CR/LF, or
 * leading/trailing whitespace; internal quotes are escaped by doubling.
 */
export function escapeCSVField(value: string): string {
  const needsQuotes =
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r") ||
    value !== value.trim();

  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

/** Convert a raw cell value into its CSV string representation. */
function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Serialize rows into a CSV document (with UTF-8 BOM for Excel compatibility).
 * Columns define both the header order and which fields are emitted.
 */
export function toCSV(
  rows: Record<string, unknown>[],
  columns: string[],
): string {
  const lines: string[] = [];
  lines.push(columns.map((c) => escapeCSVField(c)).join(","));
  for (const row of rows) {
    lines.push(columns.map((c) => escapeCSVField(stringifyCell(row[c]))).join(","));
  }
  return BOM + lines.join("\r\n") + "\r\n";
}

/**
 * Parse an entire CSV document into a matrix of string cells.
 * Handles quoted fields, doubled quotes, and embedded newlines. Strips a
 * leading BOM and normalizes CRLF/CR line endings.
 */
export function parseCSV(text: string): string[][] {
  let input = text;
  if (input.startsWith(BOM)) input = input.slice(1);

  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (ch === ",") {
      record.push(field);
      field = "";
      i++;
      continue;
    }

    if (ch === "\r") {
      // Treat CRLF and bare CR as a single record terminator.
      if (input[i + 1] === "\n") i++;
      record.push(field);
      records.push(record);
      record = [];
      field = "";
      i++;
      continue;
    }

    if (ch === "\n") {
      record.push(field);
      records.push(record);
      record = [];
      field = "";
      i++;
      continue;
    }

    field += ch;
    i++;
  }

  // Flush the final field/record if the document did not end with a newline.
  if (field.length > 0 || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  // Drop trailing completely-empty records (e.g. from a final newline).
  return records.filter((r) => !(r.length === 1 && r[0] === ""));
}

export interface ParsedCSV {
  header: string[];
  rows: Record<string, string>[];
}

/**
 * Parse a CSV document into objects keyed by the header row.
 * Missing columns become empty strings; extra cells are ignored.
 */
export function parseCSVToObjects(text: string): ParsedCSV {
  const matrix = parseCSV(text);
  if (matrix.length === 0) return { header: [], rows: [] };

  const header = matrix[0].map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let r = 1; r < matrix.length; r++) {
    const cells = matrix[r];
    const obj: Record<string, string> = {};
    for (let c = 0; c < header.length; c++) {
      obj[header[c]] = cells[c] ?? "";
    }
    rows.push(obj);
  }

  return { header, rows };
}
