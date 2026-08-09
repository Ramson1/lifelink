import { NextResponse } from "next/server";

import { getSession, SESSION_COOKIE } from "@/lib/admin/session";
import { writeAuditLog } from "@/lib/admin/audit";

export async function POST() {
  const session = await getSession();
  if (session) {
    await writeAuditLog({
      session,
      action: "admin.logout",
      entityType: "admin",
      entityId: session.id,
    });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
