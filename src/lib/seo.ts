import type { Metadata } from "next";

import { brand } from "@/lib/brand";

/**
 * Canonical site origin. Set NEXT_PUBLIC_SITE_URL in the environment to the
 * production domain (e.g. https://lifelinkgroup.org). The fallback keeps local
 * builds working but should be replaced for real deployments so canonical URLs,
 * Open Graph tags, the sitemap and robots.txt all resolve correctly.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lifelinkgroup.org"
).replace(/\/+$/, "");

export const DEFAULT_OG_IMAGE = "/branding/LOGO.png";

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, SITE_URL).toString();
}

const KEYWORDS = [
  "LifeLink Group",
  "LifeLink Group International Limited",
  "cooperative society Nigeria",
  "humanitarian services Nigeria",
  "community-based organization Africa",
  "economic empowerment Nigeria",
  "land banking Nigeria",
  "food bank Nigeria",
  "solar energy Nigeria",
  "digital assets Nigeria",
  "investment and loans Nigeria",
  "affiliate marketing Nigeria",
  "Port Harcourt",
  "Rivers State",
];

/**
 * Build a page-level Metadata object with canonical URL, Open Graph and
 * Twitter card. Titles are relative — the root layout template appends the
 * brand suffix automatically.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  openGraphType = "website",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  openGraphType?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const image = absoluteUrl(DEFAULT_OG_IMAGE);
  return {
    title,
    description,
    keywords: keywords ? [...new Set([...KEYWORDS, ...keywords])] : KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: openGraphType,
      url,
      title,
      description,
      images: [{ url: image, width: 512, height: 512, alt: brand.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ─────────────────────────  JSON-LD structured data  ───────────────────── */

const ORG_ID = `${SITE_URL}/#organization`;

/** Organization / LocalBusiness — the authoritative entity for AEO engines. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "NGO"],
    "@id": ORG_ID,
    name: brand.name,
    alternateName: brand.shortName,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: brand.intro,
    slogan: brand.tagline,
    foundingDate: "2004",
    areaServed: "NG",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2 Ordu Avenue, East-West Road, Rumudara",
      addressLocality: "Port Harcourt",
      addressRegion: "Rivers State",
      addressCountry: "NG",
    },
    contactPoint: brand.contact.phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: ["English"],
    })),
    founder: {
      "@type": "Person",
      name: "Pst. Sylvester Obi Nwagbo",
      jobTitle: "Founder and CEO",
    },
  };
}

/** WebSite node — enables sitename rich results and entity linking. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: brand.name,
    description: brand.intro,
    inLanguage: "en-NG",
    publisher: { "@id": ORG_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList for a given navigation trail. */
export function breadcrumbLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** FAQPage — the primary AEO format for answer / featured snippets. */
export function faqLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Service schema for a sector / offering page. */
export function serviceLd({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType,
    areaServed: "NG",
    provider: { "@id": ORG_ID },
  };
}

/** ItemList — used by the services overview to enumerate every sector. */
export function itemListLd(
  items: { name: string; description: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: serviceLd({
        name: it.name,
        description: it.description,
        path: it.path,
      }),
    })),
  };
}

/**
 * Article schema (NewsArticle for the news section, BlogPosting for the blog)
 * — the structured-data format answer engines and Google use to surface and
 * richly display editorial content.
 */
export function articleLd({
  kind,
  title,
  description,
  path,
  image,
  author,
  datePublished,
  dateModified,
}: {
  kind: "blog" | "news";
  title: string;
  description: string;
  path: string;
  image?: string | null;
  author?: string;
  datePublished?: string | null;
  dateModified?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": kind === "news" ? "NewsArticle" : "BlogPosting",
    headline: title,
    description,
    image: image ? absoluteUrl(image) : absoluteUrl(DEFAULT_OG_IMAGE),
    inLanguage: "en-NG",
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? datePublished ?? undefined,
    author: {
      "@type": "Person",
      name: author ?? brand.shortName,
    },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(path),
    },
  };
}

/**
 * CollectionPage — used by the blog / news index pages so search engines
 * understand the page is a curated listing of articles.
 */
export function collectionLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { title: string; slug: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    hasPart: items.map((it) => ({
      "@type": "WebPage",
      url: absoluteUrl(`${path}/${it.slug}`),
      name: it.title,
    })),
  };
}

