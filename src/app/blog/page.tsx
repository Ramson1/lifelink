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
  title: "Blog",
  description:
    "Insights, guides and stories from LifeLink Group on cooperative savings, investment, empowerment, energy and building lasting wealth across Nigeria.",
  path: "/blog",
  keywords: [
    "LifeLink blog",
    "cooperative savings Nigeria",
    "financial empowerment articles",
    "investment tips Nigeria",
  ],
});

export default async function BlogPage() {
  const posts = await listPublishedPosts("blog");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          collectionLd({
            name: "LifeLink Group Blog",
            description: "Articles and insights from LifeLink Group.",
            path: "/blog",
            items: posts.map((p) => ({ title: p.title, slug: p.slug })),
          }),
        ]}
      />
      <PostsListing
        kind="blog"
        heading="Insights & Stories"
        subheading="Practical guidance and thought leadership from LifeLink Group — helping ordinary people build extraordinary futures."
        posts={posts}
      />
    </>
  );
}
