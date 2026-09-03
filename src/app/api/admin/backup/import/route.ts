import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { canCrudRole } from "@/lib/admin/roles";
import { writeAuditLog } from "@/lib/admin/audit";
import { runImport, type ConflictMode, type ImportFile } from "@/lib/admin/backup";

export const runtime = "nodejs";
export const maxDuration = 60;

/* ── Import / restore application data from CSV or a backup bundle ── */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  if (!canCrudRole(auth.session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 },
    );
  }

  const mode = (formData.get("mode") ?? "skip") as ConflictMode;
  if (mode !== "skip" && mode !== "update") {
    return NextResponse.json(
      { error: "mode must be 'skip' or 'update'" },
      { status: 400 },
    );
  }
  const dryRun = String(formData.get("dryRun") ?? "false") === "true";

  const uploaded = formData.getAll("files").filter(
    (f): f is File => f instanceof File,
  );
  if (uploaded.length === 0) {
    return NextResponse.json(
      { error: "No files uploaded" },
      { status: 400 },
    );
  }

  const files: ImportFile[] = [];
  for (const file of uploaded) {
    const text = await file.text();
    files.push({ name: file.name, text });
  }

  const supabase = createServiceClient();

  try {
    const report = await runImport(supabase, files, mode, dryRun);

    await writeAuditLog({
      session: auth.session,
      action: "backup.import",
      entityType: "backup",
      details: {
        dryRun,
        mode,
        fileCount: files.length,
        totals: report.totals,
      },
      ipAddress: auth.ip,
    });

    return NextResponse.json(report);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
