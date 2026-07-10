import { notFound } from "next/navigation";
import { InnerPage } from "@/components/storefront/InnerPage";
import { getArticleBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <InnerPage title={post.title}>
      <article className="prose prose-purple max-w-none text-purple-deep/75">
        <p className="whitespace-pre-wrap">{post.body}</p>
      </article>
    </InnerPage>
  );
}
