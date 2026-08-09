import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "lf_admin_token";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_super_admin: boolean;
}

export async function signSession(admin: AdminSession): Promise<string> {
  return new SignJWT({
    id: admin.id,
    email: admin.email,
    full_name: admin.full_name,
    role: admin.role,
    is_super_admin: admin.is_super_admin,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySession(
  token: string,
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const id = payload.id as string | undefined;
    const email = payload.email as string | undefined;
    if (!id || !email) return null;
    return {
      id,
      email,
      full_name: (payload.full_name as string) ?? "",
      role: (payload.role as string) ?? "",
      is_super_admin: Boolean(payload.is_super_admin),
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
