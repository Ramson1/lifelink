import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  location: z.string().optional().default(""),
  event_date: z.string().optional().nullable().default(null),
  image_url: z.string().optional().default(""),
  is_upcoming: z.boolean().default(true),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

/* ── GET ── */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";
  const supabase = createServiceClient();

  if (isAdmin) {
    const auth = await requireAdmin();
    if ("response" in auth) return auth.response;
    const { data, error } = await supabase
      .from("lifelink_events")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("event_date", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data ?? [] });
  }

  const { data, error } = await supabase
    .from("lifelink_events")
    .select("id, title, description, location, event_date, image_url, is_upcoming")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("event_date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

/* ── POST ── */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const json = await request.json().catch(() => null);
  const parsed = itemSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("lifelink_events").insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "event.create", entityType: "event", entityId: data.id, ipAddress: auth.ip });
  return NextResponse.json({ item: data }, { status: 201 });
}

/* ── PUT ── */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const json = await request.json().catch(() => null);
  const { id, ...fields } = json ?? {};
  if (!id) return NextResponse.json({ error: "Missing event id" }, { status: 400 });

  const parsed = itemSchema.partial().safeParse(fields);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("lifelink_events").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "event.update", entityType: "event", entityId: id, ipAddress: auth.ip });
  return NextResponse.json({ item: data });
}

/* ── DELETE ── */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing event id" }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("lifelink_events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "event.delete", entityType: "event", entityId: id, ipAddress: auth.ip });
  return NextResponse.json({ ok: true });
}
