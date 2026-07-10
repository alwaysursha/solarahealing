import Link from "next/link";
import { InnerPage } from "@/components/storefront/InnerPage";
import { getPublishedArticles } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await getPublishedArticles();

  return (
    <InnerPage
      title="Healing Insights"
      description="Articles on Reiki, energy healing, and conscious living."
    >
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-purple-deep/10 bg-cream/40 p-5 transition hover:border-gold/35"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-purple-deep/45">{post.category}</p>
              <h2 className="mt-2 font-serif text-2xl text-purple-deep">{post.title}</h2>
              <p className="mt-2 text-sm text-purple-deep/65">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </InnerPage>
  );
}
