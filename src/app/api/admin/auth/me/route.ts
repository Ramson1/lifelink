import { NextResponse } from "next/server";

import { getSession } from "@/lib/admin/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    admin: {
      id: session.id,
      email: session.email,
      full_name: session.full_name,
      role: session.role,
      is_super_admin: session.is_super_admin,
    },
  });
}
