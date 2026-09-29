import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Post, PostKind } from "@/lib/posts";

export function formatPostDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

const KIND_LABEL: Record<PostKind, string> = { blog: "Blog", news: "News" };

export function PostCard({ post }: { post: Post }) {
  const href = `/${post.kind}/${post.slug}`;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/70 transition hover:shadow-lg dark:border-white/20 dark:bg-slate-900/70"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-500">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/90">
            <span className="text-sm font-semibold uppercase tracking-widest">
              {KIND_LABEL[post.kind]}
            </span>
          </div>
        )}
        {post.featured && (
          <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            Featured
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-600 dark:bg-white/10 dark:text-white/80">
            {KIND_LABEL[post.kind]}
          </span>
          {post.category && <span>{post.category}</span>}
        </div>
        <h3 className="mt-3 text-base font-bold leading-snug text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-6 text-black/70 dark:text-white/70 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-black/50 dark:text-white/50">
          <span>{post.author}</span>
          <span>{formatPostDate(post.published_at)}</span>
        </div>
      </div>
    </Link>
  );
}

export function PostsListing({
  kind,
  heading,
  subheading,
  posts,
}: {
  kind: PostKind;
  heading: string;
  subheading: string;
  posts: Post[];
}) {
  return (
    <div className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
      <MeshGradient variant="ocean" />
      <Container>
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">
                {KIND_LABEL[kind]}
              </div>
              <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              {heading}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              {subheading}
            </p>
          </div>
        </ScrollReveal>

        {posts.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 80}>
                <PostCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-black/10 bg-white/70 p-10 text-center dark:border-white/20 dark:bg-slate-900/70">
            <div className="text-4xl">✍️</div>
            <div className="mt-3 text-sm font-semibold text-black dark:text-white">
              Nothing published yet
            </div>
            <div className="mt-1 text-xs text-black/60 dark:text-white/60">
              New {KIND_LABEL[kind].toLowerCase()} articles will appear here soon. Check back shortly.
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
