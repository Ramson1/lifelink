import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const itemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().min(1).default("general"),
  sort_order: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

/* ── Public: list published FAQs ── */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  const supabase = createServiceClient();

  if (isAdmin) {
    // Admin endpoint: return all FAQs (including unpublished)
    const auth = await requireAdmin();
    if ("response" in auth) return auth.response;

    const { data, error } = await supabase
      .from("lifelink_faqs")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ items: data ?? [] });
  }

  // Public endpoint: only published FAQs
  const { data, error } = await supabase
    .from("lifelink_faqs")
    .select("id, question, answer, category, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

/* ── Create a new FAQ ── */
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
    .from("lifelink_faqs")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "faq.create",
    entityType: "faq",
    entityId: data.id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ item: data }, { status: 201 });
}

/* ── Update an existing FAQ ── */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const json = await request.json().catch(() => null);
  const { id, ...fields } = json ?? {};
  if (!id) {
    return NextResponse.json({ error: "Missing FAQ id" }, { status: 400 });
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
    .from("lifelink_faqs")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "faq.update",
    entityType: "faq",
    entityId: id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ item: data });
}

/* ── Delete an FAQ ── */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing FAQ id" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("lifelink_faqs")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    session: auth.session,
    action: "faq.delete",
    entityType: "faq",
    entityId: id,
    ipAddress: auth.ip,
  });

  return NextResponse.json({ ok: true });
}
