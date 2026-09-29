import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const itemSchema = z.object({
  kind: z.enum(["blog", "news"]).default("blog"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional().default(""),
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
  cover_image_url: z.string().nullable().optional().default(null),
  author: z.string().optional().default("LifeLink Group Editorial Team"),
  category: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  published_at: z.string().nullable().optional().default(null),
  meta_title: z.string().nullable().optional().default(null),
  meta_description: z.string().nullable().optional().default(null),
  sort_order: z.number().int().min(0).default(0),
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Guarantee a unique slug within the table (optionally excluding a row id). */
async function ensureUniqueSlug(
  supabase: ReturnType<typeof createServiceClient>,
  base: string,
  excludeId?: string,
): Promise<string> {
  let candidate = base || "post";
  let suffix = 1;
  // Bound the loop to avoid pathological collisions.
  while (suffix < 50) {
    const { data } = await supabase
      .from("lifelink_posts")
      .select("id, slug")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data || data.id === excludeId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return `${base}-${Date.now()}`;
}

/* ── GET ── */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";
  const kind = searchParams.get("kind");
  const supabase = createServiceClient();

  let query = supabase.from("lifelink_posts").select("*");
  if (kind === "blog" || kind === "news") query = query.eq("kind", kind);

  if (isAdmin) {
    const auth = await requireAdmin();
    if ("response" in auth) return auth.response;
    const { data, error } = await query
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data ?? [] });
  }

  const { data, error } = await query
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

/* ── POST ── */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const json = await request.json().catch(() => null);
  const parsed = itemSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const supabase = createServiceClient();
  const baseSlug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);
  const slug = await ensureUniqueSlug(supabase, baseSlug);

  const payload = {
    ...parsed.data,
    slug,
    published_at: parsed.data.published_at ?? new Date().toISOString(),
  };
  const { data, error } = await supabase.from("lifelink_posts").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "post.create", entityType: "post", entityId: data.id, ipAddress: auth.ip });
  return NextResponse.json({ item: data }, { status: 201 });
}

/* ── PUT ── */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const json = await request.json().catch(() => null);
  const { id, ...fields } = json ?? {};
  if (!id) return NextResponse.json({ error: "Missing post id" }, { status: 400 });

  const parsed = itemSchema.partial().safeParse(fields);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const supabase = createServiceClient();
  const update: Record<string, unknown> = { ...parsed.data, updated_at: new Date().toISOString() };

  // Re-slug only when the slug field was explicitly changed.
  if (parsed.data.slug !== undefined) {
    const baseSlug = slugify(parsed.data.slug || (parsed.data.title ?? ""));
    update.slug = await ensureUniqueSlug(supabase, baseSlug, id);
  }

  const { data, error } = await supabase
    .from("lifelink_posts")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "post.update", entityType: "post", entityId: id, ipAddress: auth.ip });
  return NextResponse.json({ item: data });
}

/* ── DELETE ── */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing post id" }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("lifelink_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ session: auth.session, action: "post.delete", entityType: "post", entityId: id, ipAddress: auth.ip });
  return NextResponse.json({ ok: true });
}
