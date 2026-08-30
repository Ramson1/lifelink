import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo_url: z.string().min(1, "Logo URL is required"),
  website_url: z.string().optional().default(""),
  category: z.string().min(1).default("partner"),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

/* ── GET: list partners ── */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  const supabase = createServiceClient();

  if (isAdmin) {
    const auth = await requireAdmin();
    if ("response" in auth) return auth.response;

    const { data, error } = await supabase
      .from("lifelink_partners")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ items: data ?? [] });
  }

  // Public endpoint: only active partners
  const { data, error } = await supabase
    .from("lifelink_partners")
    .select("id, name, logo_url, website_url, category, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

/* ── POST: create a partner ── */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const json = await request.json().catch(() => null);
  const parsed = itemSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_partners")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "partner.create",
    entityType: "partner",
    entityId: data.id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ item: data }, { status: 201 });
}

/* ── PUT: update a partner ── */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const json = await request.json().catch(() => null);
  const { id, ...fields } = json ?? {};
  if (!id) {
    return NextResponse.json({ error: "Missing partner id" }, { status: 400 });
  }

  const parsed = itemSchema.partial().safeParse(fields);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_partners")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "partner.update",
    entityType: "partner",
    entityId: id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ item: data });
}

/* ── DELETE: remove a partner ── */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing partner id" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("lifelink_partners")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "partner.delete",
    entityType: "partner",
    entityId: id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ ok: true });
}
