"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Save,
  X,
  Star,
} from "lucide-react";

import FileUpload from "@/components/admin/FileUpload";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

const schema = z.object({
  kind: z.enum(["blog", "news"]),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  cover_image_url: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean(),
  is_published: z.boolean(),
  published_at: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  sort_order: z.number().int().min(0),
});

type Form = z.infer<typeof schema>;

interface PostRow {
  id: string;
  kind: "blog" | "news";
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author: string;
  category: string;
  tags: string;
  featured: boolean;
  is_published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const DEFAULT_FORM: Form = {
  kind: "blog",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  author: "LifeLink Group Editorial Team",
  category: "",
  tags: "",
  featured: false,
  is_published: true,
  published_at: "",
  meta_title: "",
  meta_description: "",
  sort_order: 0,
};

export default function PostsAdminPage() {
  const [items, setItems] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "blog" | "news">("all");
  const { showToast, confirm, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_FORM,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts?admin=true");
      const json = await res.json().catch(() => ({}));
      setItems(json.items ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.kind === filter)),
    [items, filter],
  );

  const openCreate = () => {
    setEditingId(null);
    reset({ ...DEFAULT_FORM, sort_order: items.length });
    setShowForm(true);
  };

  const openEdit = (p: PostRow) => {
    setEditingId(p.id);
    reset({
      kind: p.kind,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      cover_image_url: p.cover_image_url ?? "",
      author: p.author,
      category: p.category,
      tags: p.tags,
      featured: p.featured,
      is_published: p.is_published,
      published_at: p.published_at ? p.published_at.slice(0, 16) : "",
      meta_title: p.meta_title ?? "",
      meta_description: p.meta_description ?? "",
      sort_order: p.sort_order,
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const onSubmit = async (values: Form) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        slug: values.slug ? slugify(values.slug) : slugify(values.title),
        cover_image_url: values.cover_image_url || null,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
        published_at: values.published_at || null,
      };
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload);
      const res = await fetch("/api/admin/posts", { method, headers: { "Content-Type": "application/json" }, body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { showToast("error", json.error ?? "Failed to save"); return; }
      showToast("success", editingId ? "Post updated" : "Post created");
      closeForm();
      await load();
    } catch { showToast("error", "Network error"); }
    finally { setSaving(false); }
  };

  const onDelete = (id: string) => {
    confirm(
      "Delete post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      async () => {
        setDeletingId(id);
        try {
          const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
          if (!res.ok) { const json = await res.json().catch(() => ({})); showToast("error", json.error ?? "Failed to delete"); return; }
          showToast("success", "Post deleted");
          await load();
        } catch { showToast("error", "Network error"); }
        finally { setDeletingId(null); }
      }
    );
  };

  const togglePublish = async (p: PostRow) => {
    try {
      const res = await fetch("/api/admin/posts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, is_published: !p.is_published }) });
      if (!res.ok) { showToast("error", "Failed to update"); return; }
      showToast("success", p.is_published ? "Post unpublished" : "Post published");
      await load();
    } catch { showToast("error", "Network error"); }
  };

  const inputCls =
    "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white";
  const areaCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white";
  const labelCls = "mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300";

  return (
    <div className="space-y-6">
      <Alerts />
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Content</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Blog &amp; News</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Write and manage blog articles and company news published on the website.</p>
        </div>
        {canCrud && (
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95">
            <Plus className="h-4 w-4" /> Add Post
          </button>
        )}
      </header>

      {showForm && canCrud && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{editingId ? "Edit Post" : "New Post"}</h2>
            <button type="button" onClick={closeForm} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Type</label>
              <select {...register("kind")} className={inputCls}>
                <option value="blog">Blog</option>
                <option value="news">News</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input {...register("category")} className={inputCls} placeholder="e.g. Company News" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Title</label>
              <input {...register("title")} className={inputCls} />
              {errors.title && <p className="mt-1 text-xs font-semibold text-red-600">{errors.title.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Slug <span className="font-normal text-slate-400">(auto-generated from title if left blank)</span></label>
              <input {...register("slug")} className={inputCls} placeholder="my-article-slug" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Excerpt / Summary</label>
              <textarea rows={2} {...register("excerpt")} className={areaCls} placeholder="A short summary shown in listings and search results." />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Content <span className="font-normal text-slate-400">(separate paragraphs with a blank line)</span></label>
              <textarea rows={12} {...register("content")} className={areaCls} placeholder="Write your article here…" />
            </div>
            <div className="sm:col-span-2">
              <FileUpload
                label="Cover Image"
                value={watch("cover_image_url") ?? ""}
                onChange={(url) => setValue("cover_image_url", url)}
              />
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input {...register("author")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tags <span className="font-normal text-slate-400">(comma separated)</span></label>
              <input {...register("tags")} className={inputCls} placeholder="savings, community" />
            </div>
            <div>
              <label className={labelCls}>Publish Date &amp; Time</label>
              <input type="datetime-local" {...register("published_at")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" {...register("sort_order", { valueAsNumber: true })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>SEO Title <span className="font-normal text-slate-400">(optional)</span></label>
              <input {...register("meta_title")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>SEO Description <span className="font-normal text-slate-400">(optional)</span></label>
              <input {...register("meta_description")} className={inputCls} />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Featured (pin to top of listing)</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" {...register("is_published")} className="h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Published (visible on site)</span>
              </label>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Update Post" : "Create Post"}
            </button>
            <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">Cancel</button>
          </div>
        </form>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">All Posts ({filtered.length})</h2>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
            {(["all", "blog", "news"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={[
                  "rounded-lg px-3 py-1 text-xs font-semibold capitalize transition",
                  filter === k
                    ? "bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                ].join(" ")}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-slate-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">No posts yet. Create your first blog or news article above.</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.map((p) => (
              <li key={p.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                      <span className={["rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", p.kind === "news" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"].join(" ")}>
                        {p.kind}
                      </span>
                      {p.featured && <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700"><Star className="h-3 w-3" /> Featured</span>}
                      {!p.is_published && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Draft</span>}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="font-mono">/{p.kind}/{p.slug}</span>
                      {p.category && <span>{p.category}</span>}
                      {p.published_at && <span>{new Date(p.published_at).toLocaleDateString()}</span>}
                    </div>
                    {p.excerpt && <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">{p.excerpt}</p>}
                  </div>
                  <div className="flex flex-none items-center gap-1">
                    {canCrud && (
                      <>
                        <button onClick={() => togglePublish(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300" title={p.is_published ? "Unpublish" : "Publish"}>
                          {p.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" title="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => onDelete(p.id)} disabled={deletingId === p.id} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-30 dark:hover:bg-red-900/30" title="Delete">
                          {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
