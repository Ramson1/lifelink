import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { verifyPassword } from "@/lib/admin/password";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/admin/session";
import { writeAuditLog } from "@/lib/admin/audit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: admin, error } = await supabase
    .from("lifelink_admins")
    .select("*")
    .ilike("email", parsed.data.email)
    .maybeSingle();

  if (error || !admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(parsed.data.password, admin.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signSession({
    id: admin.id,
    email: admin.email,
    full_name: admin.full_name,
    role: admin.role,
    is_super_admin: admin.is_super_admin,
  });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  await writeAuditLog({
    session: {
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      role: admin.role,
      is_super_admin: admin.is_super_admin,
    },
    action: "admin.login",
    entityType: "admin",
    entityId: admin.id,
    ipAddress: ip,
  });

  const response = NextResponse.json({
    admin: {
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      role: admin.role,
      is_super_admin: admin.is_super_admin,
    },
  });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
