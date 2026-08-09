import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";
import { sendEmail } from "@/lib/email/resend";
import { brand } from "@/lib/brand";

const createSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
  recipient_mode: z.enum(["all", "selected"]),
  user_ids: z.array(z.string().uuid()).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_notifications")
    .select(
      "id, subject, body, recipient_mode, created_at, admin_id, lifelink_admins:lifelink_notifications_admin_id_fkey(full_name, email)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ notifications: data ?? [] });
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

  // Resolve recipients
  let userIds: string[] = [];
  if (parsed.data.recipient_mode === "all") {
    const { data: all } = await supabase.from("lifelink_users").select("id, email");
    userIds = (all ?? []).map((u) => u.id);
  } else {
    userIds = parsed.data.user_ids ?? [];
  }

  if (userIds.length === 0) {
    return NextResponse.json(
      { error: "No recipients selected" },
      { status: 400 },
    );
  }

  const { data: users } = await supabase
    .from("lifelink_users")
    .select("id, email, full_name")
    .in("id", userIds);

  const recipients = users ?? [];

  // Create notification record
  const { data: notification, error: nErr } = await supabase
    .from("lifelink_notifications")
    .insert({
      admin_id: session.id,
      subject: parsed.data.subject,
      body: parsed.data.body,
      recipient_mode: parsed.data.recipient_mode,
    })
    .select()
    .single();

  if (nErr || !notification) {
    return NextResponse.json(
      { error: nErr?.message ?? "Failed to create notification" },
      { status: 500 },
    );
  }

  // Create recipient rows
  const recipientRows = recipients.map((u) => ({
    notification_id: notification.id,
    user_id: u.id,
    status: "queued" as const,
  }));
  if (recipientRows.length) {
    await supabase.from("lifelink_notification_recipients").insert(recipientRows);
  }

  // Send emails
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6366f1, #06b6d4); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">${brand.shortName}</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
        <h2 style="margin: 0 0 12px; color: #0f172a;">${parsed.data.subject}</h2>
        <div style="color: #334155; line-height: 1.6; white-space: pre-wrap;">${parsed.data.body}</div>
        <p style="margin-top: 24px; color: #94a3b8; font-size: 12px;">
          This message was sent by ${brand.shortName} administration.
        </p>
      </div>
    </div>
  `.trim();

  for (const user of recipients) {
    if (!user.email) continue;
    const result = await sendEmail({
      to: user.email,
      subject: parsed.data.subject,
      html,
    });
    await supabase
      .from("lifelink_notification_recipients")
      .update({
        status: result.ok ? "sent" : "failed",
        sent_at: result.ok ? new Date().toISOString() : null,
      })
      .eq("notification_id", notification.id)
      .eq("user_id", user.id);
  }

  await writeAuditLog({
    session,
    action: "notification.send",
    entityType: "notification",
    entityId: notification.id,
    details: {
      subject: parsed.data.subject,
      recipient_mode: parsed.data.recipient_mode,
      recipient_count: recipients.length,
    },
    ipAddress: ip,
  });

  return NextResponse.json(
    {
      notification,
      sent_count: recipients.length,
    },
    { status: 201 },
  );
}
