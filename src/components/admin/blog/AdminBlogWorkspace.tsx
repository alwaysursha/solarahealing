"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminCatalogImageField } from "@/components/admin/AdminCatalogImageField";
import { ARTICLE_CATEGORIES, articleBodyToEditorHtml } from "@/lib/article-content";
import {
  deleteArticleFormAction,
  upsertArticleAction,
} from "@/lib/admin/actions";
import { normalizeSlug } from "@/lib/slug";

const ArticleBodyEditor = dynamic(
  () =>
    import("@/components/admin/blog/ArticleBodyEditor").then((mod) => mod.ArticleBodyEditor),
  {
    ssr: false,
    loading: () => <div className="article-body-editor-loading" aria-hidden />,
  },
);

export type AdminBlogArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  updatedAt: string;
};

type EditorState = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  slugTouched: boolean;
};

function emptyEditor(sortOrder: number): EditorState {
  return {
    id: null,
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    category: "Insights",
    image: "",
    imageAlt: "",
    featured: false,
    published: true,
    sortOrder,
    slugTouched: false,
  };
}

function fromArticle(article: AdminBlogArticle): EditorState {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: articleBodyToEditorHtml(article.body),
    category: article.category || "Insights",
    image: article.image,
    imageAlt: article.imageAlt,
    featured: article.featured,
    published: article.published,
    sortOrder: article.sortOrder,
    slugTouched: true,
  };
}

function StatusChip({
  tone,
  children,
}: {
  tone: "live" | "draft" | "feature" | "muted";
  children: ReactNode;
}) {
  return <span className={`admin-blog-chip admin-blog-chip-${tone}`}>{children}</span>;
}

export function AdminBlogWorkspace({ articles }: { articles: AdminBlogArticle[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "drafts" | "featured">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | "new" | null>(
    articles[0]?.id ?? "new",
  );
  const [editor, setEditor] = useState<EditorState>(() =>
    articles[0] ? fromArticle(articles[0]) : emptyEditor(articles.length),
  );

  useEffect(() => {
    if (selectedId === "new") return;
    if (!selectedId) return;
    const match = articles.find((article) => article.id === selectedId);
    if (match) setEditor(fromArticle(match));
  }, [articles, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (filter === "published" && !article.published) return false;
      if (filter === "drafts" && article.published) return false;
      if (filter === "featured" && !article.featured) return false;
      if (!q) return true;
      return (
        article.title.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        article.slug.toLowerCase().includes(q)
      );
    });
  }, [articles, filter, query]);

  const openNew = () => {
    setSelectedId("new");
    setEditor(emptyEditor(articles.length));
    setSaved(false);
  };

  const openArticle = (article: AdminBlogArticle) => {
    setSelectedId(article.id);
    setEditor(fromArticle(article));
    setSaved(false);
  };

  const patch = <K extends keyof EditorState>(key: K, value: EditorState[K]) => {
    setSaved(false);
    setEditor((current) => {
      if (key === "title" && !current.slugTouched) {
        return {
          ...current,
          title: value as string,
          slug: normalizeSlug(value as string),
        };
      }
      if (key === "slug") {
        return { ...current, slug: value as string, slugTouched: true };
      }
      return { ...current, [key]: value };
    });
  };

  const save = () => {
    startTransition(async () => {
      const formData = new FormData();
      if (editor.id) formData.set("id", editor.id);
      formData.set("title", editor.title);
      formData.set("slug", editor.slug);
      formData.set("excerpt", editor.excerpt);
      formData.set("body", editor.body);
      formData.set("category", editor.category.trim() || "Insights");
      formData.set("image", editor.image);
      formData.set("imageAlt", editor.imageAlt);
      formData.set("sortOrder", String(editor.sortOrder));
      if (editor.featured) formData.set("featured", "on");
      if (editor.published) formData.set("published", "on");

      const result = await upsertArticleAction(formData);
      if (result?.id) {
        setSelectedId(result.id);
        setEditor((current) => ({
          ...current,
          id: result.id,
          slug: result.slug,
          slugTouched: true,
        }));
      }
      setSaved(true);
      router.refresh();
      window.setTimeout(() => setSaved(false), 2400);
    });
  };

  const previewHref = editor.slug ? `/articles/${editor.slug}` : "/articles";
  const isNew = selectedId === "new" || !editor.id;

  return (
    <div className="admin-blog-workspace">
      <div className="admin-blog-toolbar">
        <div className="admin-blog-filters" role="tablist" aria-label="Filter articles">
          {(
            [
              ["all", "All"],
              ["published", "Published"],
              ["drafts", "Drafts"],
              ["featured", "Featured"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              className={[
                "admin-blog-filter",
                filter === value ? "admin-blog-filter-active" : "",
              ].join(" ")}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="admin-blog-toolbar-actions">
          <label className="admin-blog-search">
            <span className="sr-only">Search articles</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, category, slug…"
            />
          </label>
          <button type="button" className="admin-blog-write-btn" onClick={openNew}>
            Write article
          </button>
        </div>
      </div>

      <div className="admin-blog-layout">
        <aside className="admin-blog-list-pane">
          <div className="admin-blog-list-head">
            <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
              Library
            </p>
            <p className="admin-blog-list-count">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            </p>
          </div>

          <div className="admin-blog-list">
            {filtered.length === 0 ? (
              <div className="admin-blog-list-empty">
                <p className="font-serif text-xl">No articles here</p>
                <p className="mt-1 text-sm opacity-70">Try another filter, or write a new piece.</p>
                <button type="button" className="admin-blog-write-btn mt-4" onClick={openNew}>
                  Write article
                </button>
              </div>
            ) : (
              filtered.map((article) => {
                const active = selectedId === article.id;
                return (
                  <button
                    key={article.id}
                    type="button"
                    className={["admin-blog-list-item", active ? "admin-blog-list-item-active" : ""].join(
                      " ",
                    )}
                    onClick={() => openArticle(article)}
                  >
                    <div className="admin-blog-list-thumb">
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      ) : (
                        <span className="admin-blog-list-thumb-fallback" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="admin-blog-list-category">{article.category || "Insights"}</p>
                      <p className="admin-blog-list-title">{article.title || "Untitled"}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <StatusChip tone={article.published ? "live" : "draft"}>
                          {article.published ? "Published" : "Draft"}
                        </StatusChip>
                        {article.featured ? <StatusChip tone="feature">Homepage</StatusChip> : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="admin-blog-editor-pane" aria-label={isNew ? "New article" : "Edit article"}>
          <header className="admin-blog-editor-head">
            <div>
              <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
                {isNew ? "New article" : "Editing"}
              </p>
              <h3 className="admin-blog-editor-title">
                {editor.title.trim() || (isNew ? "Untitled article" : "Edit article")}
              </h3>
              <p className="admin-blog-editor-hint">
                Homepage cards use title, excerpt, image, and category. The full story body appears on the article
                page.
              </p>
            </div>
            <div className="admin-blog-editor-actions">
              {editor.slug ? (
                <Link href={previewHref} target="_blank" className="admin-blog-ghost-btn">
                  Preview
                </Link>
              ) : null}
              <button
                type="button"
                className="admin-blog-save-btn"
                disabled={pending || !editor.title.trim()}
                onClick={save}
              >
                {pending ? "Saving…" : saved ? "Saved" : isNew ? "Save article" : "Save changes"}
              </button>
            </div>
          </header>

          <div className="admin-blog-editor-grid">
            <div className="admin-blog-editor-main">
              <label className="admin-blog-field">
                <span>Title</span>
                <input
                  value={editor.title}
                  onChange={(event) => patch("title", event.target.value)}
                  placeholder="What is this article about?"
                  className="admin-blog-title-input"
                />
              </label>

              <label className="admin-blog-field">
                <span>Short excerpt</span>
                <textarea
                  value={editor.excerpt}
                  onChange={(event) => patch("excerpt", event.target.value)}
                  rows={3}
                  placeholder="One or two lines shown on the homepage and blog list."
                />
              </label>

              <div className="admin-blog-field">
                <span>Article body</span>
                <ArticleBodyEditor
                  value={editor.body}
                  onChange={(html) => patch("body", html)}
                  placeholder="Write the full article here. Use headings, lists, quotes, links, and images — styled exactly like the live article page…"
                />
              </div>
            </div>

            <aside className="admin-blog-editor-side">
              <div className="admin-blog-side-card">
                <AdminCatalogImageField
                  label="Cover image"
                  folder="general"
                  aspect="16:9"
                  value={editor.image}
                  altValue={editor.imageAlt}
                  onChange={(url) => patch("image", url)}
                  onAltChange={(imageAlt) => patch("imageAlt", imageAlt)}
                  includeFocusHiddenInputs={false}
                />
              </div>

              <div className="admin-blog-side-card space-y-3">
                <label className="admin-blog-field">
                  <span>URL slug</span>
                  <input
                    value={editor.slug}
                    onChange={(event) => patch("slug", normalizeSlug(event.target.value))}
                    placeholder="auto-from-title"
                  />
                  <em className="admin-blog-field-hint">/articles/{editor.slug || "your-slug"}</em>
                </label>

                <label className="admin-blog-field">
                  <span>Category</span>
                  <input
                    list="admin-blog-categories"
                    value={editor.category}
                    onChange={(event) => patch("category", event.target.value)}
                    placeholder="Insights"
                  />
                  <datalist id="admin-blog-categories">
                    {ARTICLE_CATEGORIES.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </label>

                <label className="admin-blog-field">
                  <span>Sort order</span>
                  <input
                    type="number"
                    value={editor.sortOrder}
                    onChange={(event) => patch("sortOrder", Number(event.target.value) || 0)}
                  />
                  <em className="admin-blog-field-hint">Lower numbers appear first.</em>
                </label>

                <label className="admin-blog-toggle">
                  <input
                    type="checkbox"
                    checked={editor.published}
                    onChange={(event) => patch("published", event.target.checked)}
                  />
                  <span>
                    <strong>Published</strong>
                    <em>Visible on /articles and eligible for the homepage.</em>
                  </span>
                </label>

                <label className="admin-blog-toggle">
                  <input
                    type="checkbox"
                    checked={editor.featured}
                    onChange={(event) => patch("featured", event.target.checked)}
                  />
                  <span>
                    <strong>Feature on homepage</strong>
                    <em>Shows in the Insights section spotlight cards.</em>
                  </span>
                </label>
              </div>

              <div className="admin-blog-side-card admin-blog-appear">
                <p className="admin-blog-appear-title">Where this appears</p>
                <ul>
                  <li>
                    <strong>Blog index</strong> — title, category, excerpt{editor.image ? ", cover" : ""}
                  </li>
                  <li>
                    <strong>Article page</strong> — cover, category, title, excerpt, full body
                  </li>
                  <li>
                    <strong>Homepage</strong> —{" "}
                    {editor.featured
                      ? "featured/secondary Insights cards"
                      : "Insights list (when not featured)"}
                  </li>
                </ul>
              </div>

              {!isNew && editor.id ? (
                <AdminDeleteButton
                  action={deleteArticleFormAction}
                  hiddenFields={{ id: editor.id }}
                  itemName={editor.title || "this article"}
                  title="Delete article?"
                  description={`This permanently removes “${editor.title || "this article"}” from the blog and homepage.`}
                  label="Delete article"
                />
              ) : null}
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
