import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
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
  const requiredCols = ["full_name", "email", "phone", "address", "service_key"];
  const missing = requiredCols.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required columns: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const colIndex = (name: string) => header.indexOf(name);

  const rows: Record<string, string>[] = [];
  const errors: { row: number; message: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    for (const h of header) {
      row[h] = (cols[colIndex(h)] ?? "").trim();
    }

    // Validate required fields
    if (!row.full_name) {
      errors.push({ row: i + 1, message: "full_name is required" });
      continue;
    }
    if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ row: i + 1, message: "Valid email is required" });
      continue;
    }
    if (!row.phone) {
      errors.push({ row: i + 1, message: "phone is required" });
      continue;
    }
    if (!row.address) {
      errors.push({ row: i + 1, message: "address is required" });
      continue;
    }
    if (!row.service_key) {
      errors.push({ row: i + 1, message: "service_key is required" });
      continue;
    }

    rows.push({
      full_name: row.full_name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      occupation: row.occupation ?? "",
      next_of_kin_name: row.next_of_kin_name ?? "",
      next_of_kin_phone: row.next_of_kin_phone ?? "",
      service_key: row.service_key,
      notes: row.notes ?? "",
      status: "new",
      source: "bulk_import",
    });
  }

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No valid rows found", details: errors },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_users")
    .insert(rows)
    .select("id");

  if (error) {
    return NextResponse.json(
      { error: error.message, details: errors },
      { status: 500 },
    );
  }

  await writeAuditLog({
    session,
    action: "user.create",
    entityType: "user",
    details: { bulk: true, count: data?.length ?? 0 },
    ipAddress: ip,
  });

  return NextResponse.json({
    imported: data?.length ?? 0,
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
