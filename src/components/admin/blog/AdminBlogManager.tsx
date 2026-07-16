import { AdminCatalogHero } from "@/components/admin/catalog/AdminCatalogHero";
import { AdminBlogWorkspace } from "@/components/admin/blog/AdminBlogWorkspace";
import { prisma } from "@/lib/prisma";

export async function AdminBlogManager() {
  const articles = await prisma.article.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  const published = articles.filter((article) => article.published).length;
  const featured = articles.filter((article) => article.featured).length;
  const drafts = articles.length - published;

  return (
    <div className="admin-catalog admin-blog space-y-8">
      <AdminCatalogHero
        accent="purple"
        eyebrow="Content studio"
        title="Blog & articles"
        description="Write healing insights once — they flow to the homepage Insights section, the blog index, and each article page. Upload a cover, add a short excerpt, then write the full story."
        stats={[
          { label: "Total articles", value: articles.length, detail: "In your content library" },
          { label: "Published", value: published, detail: "Live on the storefront" },
          { label: "Homepage featured", value: featured, detail: "Spotlighted in Insights" },
          { label: "Drafts", value: drafts, detail: "Hidden until you publish" },
        ]}
      />

      <AdminBlogWorkspace
        articles={articles.map((article) => ({
          ...article,
          updatedAt: article.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
