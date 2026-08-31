import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const overviewItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const featureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const sectorSchema = z.object({
  key: z.string().min(1, "Key is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().default(""),
  description: z.string().default(""),
  icon: z.string().default("Star"),
  color_from: z.string().default("#6366f1"),
  color_to: z.string().default("#4f46e5"),
  tagline: z.string().default(""),
  overview: z.array(overviewItemSchema).default([]),
  features: z.array(featureSchema).default([]),
  benefits: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  accepting_registrations: z.boolean().default(false),
});

/* ── List sectors ── */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";
  const supabase = createServiceClient();

  if (isAdmin) {
    const auth = await requireAdmin();
    if ("response" in auth) return auth.response;

    const { data, error } = await supabase
      .from("lifelink_sectors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ items: data ?? [] });
  }

  // Public endpoint: only active sectors
  const { data, error } = await supabase
    .from("lifelink_sectors")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

/* ── Create a new sector ── */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const json = await request.json().catch(() => null);
  const parsed = sectorSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_sectors")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "sector.create",
    entityType: "sector",
    entityId: data.id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ item: data }, { status: 201 });
}

/* ── Update an existing sector ── */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const json = await request.json().catch(() => null);
  const { id, ...fields } = json ?? {};
  if (!id) {
    return NextResponse.json({ error: "Missing sector id" }, { status: 400 });
  }

  const parsed = sectorSchema.partial().safeParse(fields);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lifelink_sectors")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "sector.update",
    entityType: "sector",
    entityId: id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ item: data });
}

/* ── Delete a sector ── */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing sector id" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("lifelink_sectors")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "sector.delete",
    entityType: "sector",
    entityId: id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ ok: true });
}
