import { NextResponse } from "next/server";
import { getSession, type AdminSession } from "./session";

export async function requireAdmin(): Promise<
  | { session: AdminSession; ip: string }
  | { response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  return { session, ip };
}

async function headers() {
  // Next.js 15+: headers() is async; imported lazily to avoid circular refs.
  const { headers } = await import("next/headers");
  return headers();
}
