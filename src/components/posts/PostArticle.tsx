import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import type { Post } from "@/lib/posts";
import { PostCard, formatPostDate } from "@/components/posts/PostListing";

const KIND_LABEL: Record<"blog" | "news", string> = { blog: "Blog", news: "News" };

function renderContent(content: string) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (blocks.length === 0) {
    return (
      <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
        This article does not have any content yet.
      </p>
    );
  }
  return blocks.map((block, i) => (
    <p
      key={i}
      className="mb-5 text-base leading-8 text-slate-700 dark:text-slate-300"
    >
      {block}
    </p>
  ));
}

export function PostArticle({
  post,
  related,
}: {
  post: Post;
  related: Post[];
}) {
  const path = `/${post.kind}/${post.slug}`;
  const tags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            kind: post.kind,
            title: post.title,
            description: post.meta_description || post.excerpt,
            path,
            image: post.cover_image_url,
            author: post.author,
            datePublished: post.published_at,
            dateModified: post.updated_at,
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: KIND_LABEL[post.kind], path: `/${post.kind}` },
            { name: post.title, path },
          ]),
        ]}
      />

      <article className="relative overflow-hidden pt-28 pb-16 sm:pt-32">
        <Container className="relative">
          <ScrollReveal>
            <Link
              href={`/${post.kind}`}
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-white/80 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all {post.kind}
            </Link>

            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-600 dark:bg-white/10 dark:text-white/80">
                  {KIND_LABEL[post.kind]}
                </span>
                {post.category && (
                  <span className="rounded-full bg-black/5 px-3 py-1 font-semibold text-black/60 dark:bg-white/10 dark:text-white/70">
                    {post.category}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                {post.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {post.author}
                </span>
                {post.published_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" /> {formatPostDate(post.published_at)}
                  </span>
                )}
              </div>

              <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-indigo-500 to-cyan-500 dark:border-white/10">
                {post.cover_image_url ? (
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/90">
                    <span className="text-lg font-semibold uppercase tracking-widest">
                      {KIND_LABEL[post.kind]}
                    </span>
                  </div>
                )}
              </div>

              {post.excerpt && (
                <p className="mt-8 text-lg font-medium leading-8 text-slate-700 dark:text-slate-200">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-6">{renderContent(post.content)}</div>

              {tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60 dark:bg-white/10 dark:text-white/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-5xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                More {post.kind === "news" ? "news" : "articles"}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <PostCard key={r.id} post={r} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </article>
    </>
  );
}
