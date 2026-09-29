import "server-only";

import { createServiceClient } from "@/lib/admin/supabase";

export type PostKind = "blog" | "news";

export interface Post {
  id: string;
  kind: PostKind;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author: string;
  category: string;
  tags: string;
  featured: boolean;
  is_published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * List published posts of a given kind, newest first. Used by the public
 * blog / news index pages. Returns an empty list when the table is not yet
 * available (e.g. migration not applied) so pages degrade gracefully.
 */
export async function listPublishedPosts(kind: PostKind): Promise<Post[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("lifelink_posts")
      .select("*")
      .eq("kind", kind)
      .eq("is_published", true)
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false })
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}

/** Fetch a single published post by kind + slug. */
export async function getPublishedPost(
  kind: PostKind,
  slug: string,
): Promise<Post | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("lifelink_posts")
      .select("*")
      .eq("kind", kind)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;
    return data as Post;
  } catch {
    return null;
  }
}
