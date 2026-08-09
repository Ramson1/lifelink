import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { isValidRole } from "@/lib/admin/roles";
import { writeAuditLog } from "@/lib/admin/audit";

const updateSchema = z.object({
  full_name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
  role: z
    .string()
    .refine((v) => v === undefined || isValidRole(v), {
      message: "Invalid role",
    })
    .optional(),
  password: z
    .object({
      current: z.string().min(1),
      next: z.string().min(6),
    })
    .optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { id } = await params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_admins")
    .select("id, email, full_name, role, is_super_admin, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }
  return NextResponse.json({ admin: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session, ip } = auth;

  const { id } = await params;

  // Only the admin themselves (or super admin) can change their own password
  const json = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data: target, error: fetchErr } = await supabase
    .from("lifelink_admins")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !target) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }
  if (target.is_super_admin && !session.is_super_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Password change
  if (parsed.data.password) {
    if (session.id !== id && !session.is_super_admin) {
      return NextResponse.json(
        { error: "You can only change your own password" },
        { status: 403 },
      );
    }
    const ok = await verifyPassword(
      parsed.data.password.current,
      target.password_hash,
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }
    const newHash = await hashPassword(parsed.data.password.next);
    const { error } = await supabase
      .from("lifelink_admins")
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    await writeAuditLog({
      session,
      action: "admin.password_change",
      entityType: "admin",
      entityId: id,
      ipAddress: ip,
    });
    return NextResponse.json({ ok: true });
  }

  // Regular update
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.full_name !== undefined)
    updates.full_name = parsed.data.full_name;
  if (parsed.data.email !== undefined) updates.email = parsed.data.email;
  if (parsed.data.role !== undefined) {
    // Prevent assigning super_admin role
    if (parsed.data.role === "super_admin" && !session.is_super_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    updates.role = parsed.data.role;
  }

  const { data, error } = await supabase
    .from("lifelink_admins")
    .update(updates)
    .eq("id", id)
    .select("id, email, full_name, role, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Update failed" },
      { status: 500 },
    );
  }

  await writeAuditLog({
    session,
    action: "admin.update",
    entityType: "admin",
    entityId: id,
    details: updates,
    ipAddress: ip,
  });

  return NextResponse.json({ admin: data });
}
