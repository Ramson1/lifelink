import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const updateSchema = z
  .object({
    full_name: z.string().min(1).max(160).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(5).max(40).optional(),
    address: z.string().min(1).max(240).optional(),
    occupation: z.string().max(120).optional(),
    next_of_kin_name: z.string().max(120).optional(),
    next_of_kin_phone: z.string().max(40).optional(),
    service_key: z.string().min(1).optional(),
    notes: z.string().max(2000).optional(),
    status: z.string().min(1).max(40).optional(),
  })
  .strict();

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { id } = await params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session, ip } = auth;

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  for (const [k, v] of Object.entries(parsed.data ?? {})) {
    if (v !== undefined) updates[k] = v;
  }

  const { data, error } = await supabase
    .from("lifelink_users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Update failed" },
      { status: 500 },
    );
  }

  await writeAuditLog({
    session,
    action: "user.update",
    entityType: "user",
    entityId: id,
    details: updates,
    ipAddress: ip,
  });

  return NextResponse.json({ user: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session, ip } = auth;

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("lifelink_users").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session,
    action: "user.delete",
    entityType: "user",
    entityId: id,
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}
