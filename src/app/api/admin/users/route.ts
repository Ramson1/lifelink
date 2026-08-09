import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { writeAuditLog } from "@/lib/admin/audit";

const createSchema = z.object({
  full_name: z.string().min(1).max(160),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  address: z.string().min(1).max(240),
  occupation: z.string().max(120).optional(),
  next_of_kin_name: z.string().max(120).optional(),
  next_of_kin_phone: z.string().max(40).optional(),
  service_key: z.string().min(1),
  notes: z.string().max(2000).optional(),
  status: z.string().min(1).max(40).optional(),
  source: z.string().min(1).max(40).optional(),
});

const updateSchema = createSchema.partial();

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 25)));
  const serviceKey = searchParams.get("service_key") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const supabase = createServiceClient();
  let query = supabase
    .from("lifelink_users")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (serviceKey) query = query.eq("service_key", serviceKey);
  if (status) query = query.eq("status", status);
  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`,
    );
  }

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    users: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  });
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
  const { data, error } = await supabase
    .from("lifelink_users")
    .insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address,
      occupation: parsed.data.occupation ?? "",
      next_of_kin_name: parsed.data.next_of_kin_name ?? "",
      next_of_kin_phone: parsed.data.next_of_kin_phone ?? "",
      service_key: parsed.data.service_key,
      notes: parsed.data.notes ?? "",
      status: parsed.data.status ?? "new",
      source: parsed.data.source ?? "admin",
    })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create user" },
      { status: 500 },
    );
  }

  await writeAuditLog({
    session,
    action: "user.create",
    entityType: "user",
    entityId: data.id,
    details: { email: data.email, service_key: data.service_key },
    ipAddress: ip,
  });

  return NextResponse.json({ user: data }, { status: 201 });
}
