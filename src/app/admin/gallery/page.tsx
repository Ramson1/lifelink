"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";

import FileUpload from "@/components/admin/FileUpload";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

const schema = z.object({
  image_url: z.string().min(1, "Image URL is required"),
  caption: z.string().optional(),
  category: z.string().optional(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type Form = z.infer<typeof schema>;

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "events", label: "Events" },
  { value: "partnerships", label: "Partnerships" },
  { value: "community", label: "Community" },
  { value: "training", label: "Training" },
];

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    defaultValues: { image_url: "", caption: "", category: "general", sort_order: 0, is_active: true },
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery?admin=true");
      const json = await res.json().catch(() => ({}));
      setItems(json.items ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    reset({ image_url: "", caption: "", category: "general", sort_order: items.length, is_active: true });
    setShowForm(true);
  };

  const openEdit = (g: GalleryItem) => {
    setEditingId(g.id);
    reset({ image_url: g.image_url, caption: g.caption, category: g.category, sort_order: g.sort_order, is_active: g.is_active });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const onSubmit = async (values: Form) => {
    setSaving(true);
    try {
      const url = "/api/admin/gallery";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? JSON.stringify({ id: editingId, ...values }) : JSON.stringify(values);
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { showToast("error", json.error ?? "Failed to save"); return; }
      showToast("success", editingId ? "Gallery item updated" : "Gallery item created");
      closeForm();
      await load();
    } catch { showToast("error", "Network error"); }
    finally { setSaving(false); }
  };

  const onDelete = (id: string) => {
    confirm(
      "Delete image",
      "Are you sure you want to delete this gallery image? This action cannot be undone.",
      async () => {
        setDeletingId(id);
        try {
          const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
          if (!res.ok) { const json = await res.json().catch(() => ({})); showToast("error", json.error ?? "Failed to delete"); return; }
          showToast("success", "Gallery image deleted");
          await load();
        } catch { showToast("error", "Network error"); }
        finally { setDeletingId(null); }
      }
    );
  };

  const toggleActive = async (g: GalleryItem) => {
    try {
      const res = await fetch("/api/admin/gallery", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: g.id, is_active: !g.is_active }) });
      if (!res.ok) { showToast("error", "Failed to update"); return; }
      showToast("success", g.is_active ? "Item deactivated" : "Item activated");
      await load();
    } catch { showToast("error", "Network error"); }
  };

  const categoryLabel = (val: string) => CATEGORIES.find((c) => c.value === val)?.label ?? val;

  return (
    <div className="space-y-6">
      <Alerts />
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Content</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Gallery</h1>
          <p className="mt-1 text-sm text-slate-600">Manage media gallery images displayed on the website.</p>
        </div>
        {canCrud && (
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95">
            <Plus className="h-4 w-4" /> Add Image
          </button>
        )}
      </header>

      {showForm && canCrud && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{editingId ? "Edit Image" : "New Image"}</h2>
            <button type="button" onClick={closeForm} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FileUpload
                label="Gallery Image"
                value={watch("image_url")}
                onChange={(url) => setValue("image_url", url, { shouldValidate: true })}
              />
              {errors.image_url && <p className="mt-1 text-xs font-semibold text-red-600">{errors.image_url.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Caption</label>
              <input {...register("caption")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Annual conference 2024" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
              <select {...register("category")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Sort Order</label>
              <input type="number" {...register("sort_order", { valueAsNumber: true })} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="flex items-center">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-semibold text-slate-700">Active (visible on website)</span>
              </label>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Update Image" : "Add Image"}
            </button>
            <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Cancel</button>
          </div>
        </form>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <ImageIcon className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">All Images ({items.length})</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-slate-500" /></div>
        ) : items.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">No gallery images yet. Add your first image above.</div>
        ) : (
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((g) => (
              <div key={g.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="aspect-square bg-slate-100">
                  {g.image_url ? (
                    <img src={g.image_url} alt={g.caption} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400"><ImageIcon className="h-8 w-8" /></div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-slate-900 truncate flex-1">{g.caption || "No caption"}</p>
                    {!g.is_active && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">Inactive</span>}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="rounded-full border border-slate-200 px-1.5 py-0.5 font-semibold">{categoryLabel(g.category)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {canCrud && (
                      <>
                        <button onClick={() => toggleActive(g)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title={g.is_active ? "Deactivate" : "Activate"}>
                          {g.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => openEdit(g)} className="rounded-lg p-1 text-indigo-500 hover:bg-indigo-50" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => onDelete(g.id)} disabled={deletingId === g.id} className="rounded-lg p-1 text-red-500 hover:bg-red-50 disabled:opacity-30" title="Delete">
                          {deletingId === g.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
