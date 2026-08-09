import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 50)));
  const action = searchParams.get("action") ?? undefined;
  const entityType = searchParams.get("entity_type") ?? undefined;
  const adminId = searchParams.get("admin_id") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const supabase = createServiceClient();
  let query = supabase
    .from("lifelink_audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (action) query = query.eq("action", action);
  if (entityType) query = query.eq("entity_type", entityType);
  if (adminId) query = query.eq("admin_id", adminId);
  if (q) {
    query = query.or(
      `admin_email.ilike.%${q}%,action.ilike.%${q}%,entity_id.ilike.%${q}%`,
    );
  }

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    entries: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  });
}
