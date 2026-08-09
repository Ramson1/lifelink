/**
 * Seed script for the admin dashboard.
 * Run:  node scripts/seed-super-admin.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be set.
 * Creates the super admin if it does not already exist.
 */
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SUPER_ADMIN = {
  email: "onyevid@gmail.com",
  password: "111111Ss",
  full_name: "Developer",
  role: "super_admin",
};

async function main() {
  const { data: existing } = await supabase
    .from("lifelink_admins")
    .select("id")
    .eq("email", SUPER_ADMIN.email)
    .maybeSingle();

  if (existing) {
    console.log(`Super admin already exists (${SUPER_ADMIN.email})`);
    return;
  }

  const password_hash = await bcrypt.hash(SUPER_ADMIN.password, 12);
  const { error } = await supabase.from("lifelink_admins").insert({
    email: SUPER_ADMIN.email,
    password_hash,
    full_name: SUPER_ADMIN.full_name,
    role: SUPER_ADMIN.role,
    is_super_admin: true,
  });

  if (error) {
    console.error("Failed to seed super admin:", error.message);
    process.exit(1);
  }
  console.log(`Seeded super admin: ${SUPER_ADMIN.email}`);
}

main();
