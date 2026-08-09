import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceClient } from "@/lib/admin/supabase";
import { hashPassword, verifyPassword } from "@/lib/admin/password";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  current_password: z.string().optional(),
  new_password: z.string().min(6, "New password must be at least 6 characters"),
});

export async function PUT(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { email, current_password, new_password } = parsed.data;
  const supabase = createServiceClient();

  // First check if this email belongs to an admin
  const { data: admin } = await supabase
    .from("lifelink_admins")
    .select("id, password_hash")
    .ilike("email", email)
    .maybeSingle();

  if (admin) {
    // Verify current password if it exists
    if (admin.password_hash) {
      if (!current_password) {
        return NextResponse.json(
          { error: "Please enter your current password" },
          { status: 400 },
        );
      }
      const ok = await verifyPassword(current_password, admin.password_hash);
      if (!ok) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 },
        );
      }
    }

    const newHash = await hashPassword(new_password);
    const { error } = await supabase
      .from("lifelink_admins")
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq("id", admin.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // Otherwise check regular users
  const { data: user, error: fetchErr } = await supabase
    .from("lifelink_users")
    .select("id, email, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (fetchErr || !user) {
    return NextResponse.json(
      { error: "No account found with this email address" },
      { status: 404 },
    );
  }

  // If user already has a password, verify the current one
  if (user.password_hash) {
    if (!current_password) {
      return NextResponse.json(
        { error: "Please enter your current password" },
        { status: 400 },
      );
    }
    const ok = await verifyPassword(current_password, user.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }
  }

  // Hash and update
  const newHash = await hashPassword(new_password);
  const { error: updateErr } = await supabase
    .from("lifelink_users")
    .update({ password_hash: newHash, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateErr) {
    return NextResponse.json(
      { error: updateErr.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
