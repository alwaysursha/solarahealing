import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articleBodyLooksLikeHtml } from "@/lib/article-content";
import { getArticleBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);
  if (!post || !post.published) notFound();

  const isHtml = articleBodyLooksLikeHtml(post.body);

  return (
    <div className="article-page">
      <div className="article-page-aura" aria-hidden />
      <article className="article-page-inner">
        <Link href="/articles" className="article-page-back">
          ← All articles
        </Link>

        <p className="article-page-category">{post.category}</p>
        <h1 className="article-page-title">{post.title}</h1>
        {post.excerpt ? <p className="article-page-excerpt">{post.excerpt}</p> : null}

        {post.image ? (
          <div className="article-page-cover">
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 860px"
              priority
            />
          </div>
        ) : null}

        {isHtml ? (
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        ) : (
          <div className="article-prose article-prose-plain">{post.body}</div>
        )}
      </article>
    </div>
  );
}
