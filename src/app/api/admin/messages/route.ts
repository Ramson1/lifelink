import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const createSchema = z.object({
  body: z.string().min(1).max(5000),
  recipient_ids: z.array(z.string().uuid()).min(1),
  reply_to: z.string().uuid().nullish(),
});

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { session } = auth;

  const supabase = createServiceClient();

  // Fetch messages where current admin is sender or recipient, with metadata
  const { data: received, error: rErr } = await supabase
    .from("lifelink_message_recipients")
    .select("message_id")
    .eq("admin_id", session.id);

  if (rErr) {
    return NextResponse.json({ error: rErr.message }, { status: 500 });
  }

  const receivedIds = (received ?? []).map((r) => r.message_id);

  const { data: messages, error: mErr } = await supabase
    .from("lifelink_messages")
    .select(
      "id, sender_id, body, reply_to, created_at, updated_at, sender:lifelink_admins!lifelink_messages_sender_id_fkey(id, full_name, email)",
    )
    .or(
      receivedIds.length
        ? `id.in.(${receivedIds.join(",")}),sender_id.eq.${session.id}`
        : `sender_id.eq.${session.id}`,
    )
    .order("created_at", { ascending: false });

  if (mErr) {
    return NextResponse.json({ error: mErr.message }, { status: 500 });
  }

  // Attach recipients + attachments per message
  const ids = (messages ?? []).map((m) => m.id);
  const [{ data: recipients }, { data: attachments }] = await Promise.all([
    ids.length
      ? supabase
          .from("lifelink_message_recipients")
          .select("message_id, admin_id, lifelink_admins:lifelink_message_recipients_admin_id_fkey(id, full_name, email)")
          .in("message_id", ids)
      : Promise.resolve({ data: [] }),
    ids.length
      ? supabase
          .from("lifelink_message_attachments")
          .select("id, message_id, file_url, file_name, file_type, file_size")
          .in("message_id", ids)
      : Promise.resolve({ data: [] }),
  ]);

  const recipientsByMsg: Record<string, unknown[]> = {};
  for (const r of recipients ?? []) {
    (recipientsByMsg[r.message_id] ??= []).push(r);
  }
  const attachmentsByMsg: Record<string, unknown[]> = {};
  for (const a of attachments ?? []) {
    (attachmentsByMsg[a.message_id] ??= []).push(a);
  }

  const enriched = (messages ?? []).map((m) => ({
    ...m,
    recipients: recipientsByMsg[m.id] ?? [],
    attachments: attachmentsByMsg[m.id] ?? [],
  }));

  return NextResponse.json({ messages: enriched });
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
  const { data: message, error } = await supabase
    .from("lifelink_messages")
    .insert({
      sender_id: session.id,
      body: parsed.data.body,
      reply_to: parsed.data.reply_to ?? null,
    })
    .select()
    .single();

  if (error || !message) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to send message" },
      { status: 500 },
    );
  }

  // Recipients (exclude sender)
  const recipientIds = Array.from(
    new Set(parsed.data.recipient_ids.filter((id) => id !== session.id)),
  );
  if (recipientIds.length) {
    const rows = recipientIds.map((admin_id) => ({
      message_id: message.id,
      admin_id,
    }));
    await supabase.from("lifelink_message_recipients").insert(rows);
  }

  await writeAuditLog({
    session,
    action: "message.create",
    entityType: "message",
    entityId: message.id,
    details: {
      recipient_count: recipientIds.length,
      reply_to: parsed.data.reply_to ?? null,
    },
    ipAddress: ip,
  });

  return NextResponse.json({ message }, { status: 201 });
}
