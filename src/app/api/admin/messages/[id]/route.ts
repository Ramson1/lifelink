import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const updateSchema = z.object({
  body: z.string().min(1).max(5000),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session } = auth;

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: message, error } = await supabase
    .from("lifelink_messages")
    .select(
      "id, sender_id, body, reply_to, created_at, updated_at, sender:lifelink_admins!lifelink_messages_sender_id_fkey(id, full_name, email)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  // Ensure the caller is sender or recipient
  if (message.sender_id !== session.id) {
    const { data: r } = await supabase
      .from("lifelink_message_recipients")
      .select("admin_id")
      .eq("message_id", id)
      .eq("admin_id", session.id)
      .maybeSingle();
    if (!r) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const [{ data: recipients }, { data: attachments }] = await Promise.all([
    supabase
      .from("lifelink_message_recipients")
      .select("admin_id, lifelink_admins:lifelink_message_recipients_admin_id_fkey(id, full_name, email)")
      .eq("message_id", id),
    supabase
      .from("lifelink_message_attachments")
      .select("id, file_url, file_name, file_type, file_size")
      .eq("message_id", id),
  ]);

  // Replies to this message (thread)
  const { data: replies } = await supabase
    .from("lifelink_messages")
    .select(
      "id, sender_id, body, reply_to, created_at, updated_at, sender:lifelink_admins!lifelink_messages_sender_id_fkey(id, full_name, email)",
    )
    .eq("reply_to", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    message: {
      ...message,
      recipients: recipients ?? [],
      attachments: attachments ?? [],
      replies: replies ?? [],
    },
  });
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
  const { data: message, error: fetchErr } = await supabase
    .from("lifelink_messages")
    .select("id, sender_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }
  if (message.sender_id !== session.id) {
    return NextResponse.json(
      { error: "You can only edit your own messages" },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("lifelink_messages")
    .update({ body: parsed.data.body, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session,
    action: "message.update",
    entityType: "message",
    entityId: id,
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
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
  const { data: message, error: fetchErr } = await supabase
    .from("lifelink_messages")
    .select("id, sender_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }
  if (message.sender_id !== session.id) {
    return NextResponse.json(
      { error: "You can only delete your own messages" },
      { status: 403 },
    );
  }

  const { error } = await supabase.from("lifelink_messages").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session,
    action: "message.delete",
    entityType: "message",
    entityId: id,
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}
