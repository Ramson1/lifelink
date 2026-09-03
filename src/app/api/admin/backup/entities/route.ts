import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { canCrudRole } from "@/lib/admin/roles";
import { BACKUP_ENTITIES } from "@/lib/admin/backup-schema";
import { countEntity } from "@/lib/admin/backup";

export const runtime = "nodejs";
export const maxDuration = 60;

/* ── List backup entities with live row counts ── */
export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  if (!canCrudRole(auth.session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();

  const entities = await Promise.all(
    BACKUP_ENTITIES.map(async (e) => {
      let count = 0;
      let error: string | null = null;
      try {
        count = await countEntity(supabase, e.table);
      } catch (err) {
        error = (err as Error).message;
      }
      return {
        table: e.table,
        label: e.label,
        sensitive: Boolean(e.sensitive),
        count,
        error,
      };
    }),
  );

  return NextResponse.json({ entities });
}
