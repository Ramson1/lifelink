import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const itemSchema = z.object({
  image_url: z.string().min(1, "Image URL is required"),
  caption: z.string().optional().default(""),
  category: z.string().optional().default("general"),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
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
      .from("lifelink_gallery")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data ?? [] });
  }

  const { data, error } = await supabase
    .from("lifelink_gallery")
    .select("id, image_url, caption, category")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
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
  const { data, error } = await supabase.from("lifelink_gallery").insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "gallery.create", entityType: "gallery", entityId: data.id, ipAddress: auth.ip });
  return NextResponse.json({ item: data }, { status: 201 });
}

/* ── PUT ── */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const json = await request.json().catch(() => null);
  const { id, ...fields } = json ?? {};
  if (!id) return NextResponse.json({ error: "Missing gallery id" }, { status: 400 });

  const parsed = itemSchema.partial().safeParse(fields);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("lifelink_gallery").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "gallery.update", entityType: "gallery", entityId: id, ipAddress: auth.ip });
  return NextResponse.json({ item: data });
}

/* ── DELETE ── */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing gallery id" }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("lifelink_gallery").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "gallery.delete", entityType: "gallery", entityId: id, ipAddress: auth.ip });
  return NextResponse.json({ ok: true });
}
