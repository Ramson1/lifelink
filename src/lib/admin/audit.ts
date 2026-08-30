import { createServiceClient } from "./supabase";
import type { AdminSession } from "./session";

export type AuditAction =
  | "admin.login"
  | "admin.logout"
  | "admin.create"
  | "admin.update"
  | "admin.delete"
  | "admin.password_change"
  | "user.create"
  | "user.update"
  | "user.delete"
  | "user.notify"
  | "content.update"
  | "message.create"
  | "message.update"
  | "message.delete"
  | "notification.create"
  | "notification.send"
  | "faq.create"
  | "faq.update"
  | "faq.delete"
  | "sector.create"
  | "sector.update"
  | "sector.delete";

export type EntityType =
  | "admin"
  | "user"
  | "content"
  | "message"
  | "notification"
  | "faq"
  | "sector";

export async function writeAuditLog(args: {
  session: AdminSession | null;
  action: AuditAction;
  entityType?: EntityType;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  const { session, action, entityType, entityId, details, ipAddress } = args;

  // Do not track super admin activities
  if (session?.is_super_admin) return;

  try {
    const supabase = createServiceClient();
    await supabase.from("lifelink_audit_logs").insert({
      admin_id: session?.is_super_admin ? null : (session?.id ?? null),
      admin_email: session?.email ?? "system",
      action,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
      details: details ?? {},
      ip_address: ipAddress ?? null,
    });
  } catch (err) {
    // Audit logging must never break the caller flow.
    console.error("Audit log failed", err);
  }
}
