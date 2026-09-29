import { JsonLd } from "@/components/seo/JsonLd";
import { PostsListing } from "@/components/posts/PostListing";
import { listPublishedPosts } from "@/lib/posts";
import {
  buildMetadata,
  breadcrumbLd,
  collectionLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "News",
  description:
    "The latest announcements, milestones and community updates from LifeLink Group International Limited across our sectors and humanitarian programs.",
  path: "/news",
  keywords: [
    "LifeLink news",
    "LifeLink Group announcements",
    "cooperative society news Nigeria",
    "humanitarian updates Nigeria",
  ],
});

export default async function NewsPage() {
  const posts = await listPublishedPosts("news");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "News", path: "/news" },
          ]),
          collectionLd({
            name: "LifeLink Group News",
            description: "News and announcements from LifeLink Group.",
            path: "/news",
            items: posts.map((p) => ({ title: p.title, slug: p.slug })),
          }),
        ]}
      />
      <PostsListing
        kind="news"
        heading="News & Announcements"
        subheading="Stay up to date with LifeLink Group's programs, partnerships and the communities we serve."
        posts={posts}
      />
    </>
  );
}
