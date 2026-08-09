import "server-only";

import { createServiceClient } from "@/lib/admin/supabase";

/**
 * Read a content override from the database. Falls back to the provided
 * default value when no override exists or Supabase is not configured.
 */
export async function getContent(key: string, fallback: string): Promise<string> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("lifelink_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return fallback;
    return data.value || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Read multiple content overrides in a single query.
 */
export async function getManyContent(
  entries: Array<{ key: string; fallback: string }>,
): Promise<Record<string, string>> {
  const keys = entries.map((e) => e.key);
  const fallbackMap = Object.fromEntries(
    entries.map((e) => [e.key, e.fallback]),
  );
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("lifelink_content")
      .select("key, value")
      .in("key", keys);
    const map: Record<string, string> = { ...fallbackMap };
    for (const row of data ?? []) {
      map[row.key] = row.value;
    }
    return map;
  } catch {
    return { ...fallbackMap };
  }
}
