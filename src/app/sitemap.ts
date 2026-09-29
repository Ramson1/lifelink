import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";
import { sectors } from "@/data/sectors";
import { listPublishedPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about/team`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/fundraise`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/advertising`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const sectorPages: MetadataRoute.Sitemap = sectors.map((s) => ({
    url: `${SITE_URL}/sectors/${s.key}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog & news articles (DB-first; empty when the table isn't available yet).
  const [blogPosts, newsPosts] = await Promise.all([
    listPublishedPosts("blog"),
    listPublishedPosts("news"),
  ]);

  const postPages: MetadataRoute.Sitemap = [...blogPosts, ...newsPosts].map(
    (p) => ({
      url: `${SITE_URL}/${p.kind}/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  return [...staticPages, ...sectorPages, ...postPages];
}
