import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const schema = z.object({
  value: z.string().max(10000),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session, ip } = auth;

  const { key } = await params;
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  // Upsert: insert if missing, otherwise update
  const { data: existing } = await supabase
    .from("lifelink_content")
    .select("id")
    .eq("key", key)
    .maybeSingle();

  let data;
  let error;
  if (existing) {
    ({ data, error } = await supabase
      .from("lifelink_content")
      .update({
        value: parsed.data.value,
        updated_by: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("key", key)
      .select()
      .single());
  } else {
    ({ data, error } = await supabase
      .from("lifelink_content")
      .insert({
        key,
        value: parsed.data.value,
        updated_by: session.id,
      })
      .select()
      .single());
  }

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Update failed" },
      { status: 500 },
    );
  }

  await writeAuditLog({
    session,
    action: "content.update",
    entityType: "content",
    entityId: key,
    details: { key, value: parsed.data.value },
    ipAddress: ip,
  });

  return NextResponse.json({ item: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session, ip } = auth;

  const { key } = await params;
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("lifelink_content")
    .delete()
    .eq("key", key);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  await writeAuditLog({
    session,
    action: "content.update",
    entityType: "content",
    entityId: key,
    details: { key, action: "delete" },
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}
