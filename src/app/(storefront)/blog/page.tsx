import Image from "next/image";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await getPublishedArticles();

  return (
    <div className="article-index">
      <div className="article-index-aura" aria-hidden />
      <div className="article-index-inner">
        <header className="article-index-hero">
          <p className="article-index-eyebrow">Healing insights</p>
          <h1 className="article-index-title">
            Articles for your
            <span> journey</span>
          </h1>
          <p className="article-index-copy">
            Guides on Reiki, energy healing, and conscious living from Soulara Healing Academy.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="article-index-empty">No published articles yet. Check back soon.</p>
        ) : (
          <ul className="article-index-grid">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="article-index-card">
                  <div className="article-index-media">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <span className="article-index-media-fallback" aria-hidden />
                    )}
                  </div>
                  <div className="article-index-body">
                    <p className="article-index-category">{post.category}</p>
                    <h2 className="article-index-card-title">{post.title}</h2>
                    <p className="article-index-excerpt">{post.excerpt}</p>
                    <span className="article-index-cta">Read article</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
