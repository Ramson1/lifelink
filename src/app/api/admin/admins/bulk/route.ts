import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { hashPassword } from "@/lib/admin/password";
import { isValidRole, ADMIN_ROLES } from "@/lib/admin/roles";
import { writeAuditLog } from "@/lib/admin/audit";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session, ip } = auth;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const text = await file.text();
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return NextResponse.json(
      { error: "File is empty or has no data rows" },
      { status: 400 },
    );
  }

  // Parse CSV header
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const requiredCols = ["full_name", "email", "password", "role"];
  const missing = requiredCols.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required columns: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const colIndex = (name: string) => header.indexOf(name);

  const rows: { full_name: string; email: string; password_hash: string; role: string }[] = [];
  const errors: { row: number; message: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    for (const h of header) {
      row[h] = (cols[colIndex(h)] ?? "").trim();
    }

    if (!row.full_name) {
      errors.push({ row: i + 1, message: "full_name is required" });
      continue;
    }
    if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ row: i + 1, message: "Valid email is required" });
      continue;
    }
    if (!row.password || row.password.length < 6) {
      errors.push({ row: i + 1, message: "Password must be at least 6 characters" });
      continue;
    }
    if (!row.role || !isValidRole(row.role)) {
      errors.push({
        row: i + 1,
        message: `Invalid role. Allowed: ${ADMIN_ROLES.join(", ")}`,
      });
      continue;
    }

    const password_hash = await hashPassword(row.password);
    rows.push({
      full_name: row.full_name,
      email: row.email,
      password_hash,
      role: row.role,
    });
  }

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No valid rows found", details: errors },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  // Check for duplicate emails
  const emails = rows.map((r) => r.email);
  const { data: existing } = await supabase
    .from("lifelink_admins")
    .select("email")
    .in("email", emails);

  const existingEmails = new Set((existing ?? []).map((e) => e.email.toLowerCase()));

  const toInsert = rows.filter(
    (r) => !existingEmails.has(r.email.toLowerCase()),
  );

  if (toInsert.length === 0) {
    return NextResponse.json(
      { error: "All emails already exist", details: errors },
      { status: 409 },
    );
  }

  const insertRows = toInsert.map((r) => ({
    ...r,
    is_super_admin: false,
  }));

  const { data, error } = await supabase
    .from("lifelink_admins")
    .insert(insertRows)
    .select("id");

  if (error) {
    return NextResponse.json(
      { error: error.message, details: errors },
      { status: 500 },
    );
  }

  const skipped = rows.length - toInsert.length;

  await writeAuditLog({
    session,
    action: "admin.create",
    entityType: "admin",
    details: { bulk: true, count: data?.length ?? 0, skipped },
    ipAddress: ip,
  });

  return NextResponse.json({
    imported: data?.length ?? 0,
    skipped,
    errors,
  });
}

/** Simple CSV line parser that handles quoted fields */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
