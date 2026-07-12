import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminField, AdminPanel, AdminShell, AdminSubmit } from "@/components/admin/AdminShell";
import { deleteArticleFormAction, upsertArticleAction } from "@/lib/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const rows = await prisma.article.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell
      activePath="/admin/blog"
      title="Blog & Articles"
      description="Manage every article shown on the homepage and blog."
    >
      <div className="space-y-6">
        {rows.map((article) => (
          <AdminPanel key={article.id} title={article.title}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href={`/blog/${article.slug}`} target="_blank" className="text-gold hover:text-gold-light">
                  Preview live article
                </Link>
                <span className="text-purple-deep/40">·</span>
                <span className="text-purple-deep/55">{article.category}</span>
              </div>
              <AdminDeleteButton
                action={deleteArticleFormAction}
                hiddenFields={{ id: article.id }}
                itemName={article.title}
                title="Delete article?"
                description={`This will permanently remove “${article.title}” from your blog and homepage.`}
                variant="icon"
              />
            </div>
            <form action={upsertArticleAction} className="grid gap-3 lg:grid-cols-2">
              <input type="hidden" name="id" value={article.id} />
              <AdminField label="Title" name="title" defaultValue={article.title} />
              <AdminField label="Slug" name="slug" defaultValue={article.slug} />
              <AdminField label="Category" name="category" defaultValue={article.category} />
              <AdminField label="Sort order" name="sortOrder" defaultValue={article.sortOrder} type="number" />
              <AdminField label="Image URL" name="image" defaultValue={article.image} />
              <AdminField label="Image alt" name="imageAlt" defaultValue={article.imageAlt} />
              <label className="flex items-center gap-2 text-sm text-purple-deep/75">
                <input type="checkbox" name="featured" defaultChecked={article.featured} />
                Featured on homepage
              </label>
              <label className="flex items-center gap-2 text-sm text-purple-deep/75">
                <input type="checkbox" name="published" defaultChecked={article.published} />
                Published
              </label>
              <div className="lg:col-span-2">
                <AdminField label="Excerpt" name="excerpt" defaultValue={article.excerpt} rows={2} />
              </div>
              <div className="lg:col-span-2">
                <AdminField label="Body" name="body" defaultValue={article.body} rows={8} />
              </div>
              <div className="lg:col-span-2 flex gap-3">
                <AdminSubmit label="Save article" />
              </div>
            </form>
          </AdminPanel>
        ))}

        <AdminPanel title="Add article">
          <form action={upsertArticleAction} className="grid gap-3 lg:grid-cols-2">
            <AdminField label="Title" name="title" />
            <AdminField label="Slug" name="slug" />
            <AdminField label="Category" name="category" defaultValue="Insights" />
            <AdminField label="Image URL" name="image" />
            <AdminField label="Image alt" name="imageAlt" />
            <label className="flex items-center gap-2 text-sm text-purple-deep/75">
              <input type="checkbox" name="published" defaultChecked />
              Published
            </label>
            <div className="lg:col-span-2">
              <AdminField label="Excerpt" name="excerpt" rows={2} />
            </div>
            <div className="lg:col-span-2">
              <AdminField label="Body" name="body" rows={8} />
            </div>
            <div className="lg:col-span-2">
              <AdminSubmit label="Create article" savedLabel="Created" />
            </div>
          </form>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
