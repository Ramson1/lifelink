import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { hashPassword } from "@/lib/admin/password";
import { isValidRole, ADMIN_ROLES } from "@/lib/admin/roles";
import { writeAuditLog } from "@/lib/admin/audit";

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1).max(120),
  role: z.string().refine(isValidRole, { message: "Invalid role" }),
});

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_admins")
    .select("id, email, full_name, role, is_super_admin, created_at")
    .eq("is_super_admin", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ admins: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session, ip } = auth;

  const json = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("lifelink_admins")
    .select("id")
    .ilike("email", parsed.data.email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "An admin with this email already exists" },
      { status: 409 },
    );
  }

  const password_hash = await hashPassword(parsed.data.password);
  const { data: inserted, error } = await supabase
    .from("lifelink_admins")
    .insert({
      email: parsed.data.email,
      password_hash,
      full_name: parsed.data.full_name,
      role: parsed.data.role,
      is_super_admin: false,
    })
    .select("id, email, full_name, role, created_at")
    .single();

  if (error || !inserted) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create admin" },
      { status: 500 },
    );
  }

  await writeAuditLog({
    session,
    action: "admin.create",
    entityType: "admin",
    entityId: inserted.id,
    details: { email: inserted.email, role: inserted.role },
    ipAddress: ip,
  });

  return NextResponse.json({ admin: inserted }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session, ip } = auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  if (id === session.id) {
    return NextResponse.json(
      { error: "You cannot delete your own admin account" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data: target, error: fetchErr } = await supabase
    .from("lifelink_admins")
    .select("id, email, is_super_admin")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !target) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }
  if (target.is_super_admin) {
    return NextResponse.json({ error: "Cannot delete super admin" }, { status: 403 });
  }

  const { error } = await supabase.from("lifelink_admins").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session,
    action: "admin.delete",
    entityType: "admin",
    entityId: id,
    details: { email: target.email },
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}

// Expose allowed roles for the UI
export const runtime = "nodejs";
export { ADMIN_ROLES };
