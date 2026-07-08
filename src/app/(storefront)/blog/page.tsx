import Link from "next/link";
import { InnerPage } from "@/components/storefront/InnerPage";

export const dynamic = "force-dynamic";

const PLACEHOLDER_POSTS = [
  { slug: "what-is-reiki", title: "What is Reiki?", excerpt: "An introduction to universal life energy." },
  { slug: "chakra-balancing", title: "Chakra balancing guide", excerpt: "Aligning your seven energy centers." },
];

export default async function BlogIndexPage() {
  return (
    <InnerPage
      title="Healing insights"
      description="Articles on Reiki, chakras, and spiritual wellness — loaded dynamically from the server."
    >
      <ul className="space-y-4">
        {PLACEHOLDER_POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-purple-deep/10 bg-canvas p-6 transition-colors hover:border-gold/40"
            >
              <h2 className="font-display text-xl font-semibold text-purple-deep">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-purple-deep/60">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </InnerPage>
  );
}
