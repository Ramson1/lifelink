import { notFound } from "next/navigation";

import { PostArticle } from "@/components/posts/PostArticle";
import { getPublishedPost, listPublishedPosts } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost("blog", slug);
  if (!post) return {};
  return buildMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || post.title,
    path: `/blog/${post.slug}`,
    openGraphType: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost("blog", slug);
  if (!post) return notFound();

  const all = await listPublishedPosts("blog");
  const related = all.filter((p) => p.id !== post.id).slice(0, 3);

  return <PostArticle post={post} related={related} />;
}
