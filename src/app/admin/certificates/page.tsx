"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Award,
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
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  image_url: z.string().optional(),
  icon_emoji: z.string().optional(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type Form = z.infer<typeof schema>;

interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  icon_emoji: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CertificatesAdminPage() {
  const [items, setItems] = useState<Certificate[]>([]);
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
    defaultValues: { title: "", subtitle: "", image_url: "", icon_emoji: "📜", sort_order: 0, is_active: true },
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates?admin=true");
      const json = await res.json().catch(() => ({}));
      setItems(json.items ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    reset({ title: "", subtitle: "", image_url: "", icon_emoji: "📜", sort_order: items.length, is_active: true });
    setShowForm(true);
  };

  const openEdit = (c: Certificate) => {
    setEditingId(c.id);
    reset({ title: c.title, subtitle: c.subtitle, image_url: c.image_url, icon_emoji: c.icon_emoji, sort_order: c.sort_order, is_active: c.is_active });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const onSubmit = async (values: Form) => {
    setSaving(true);
    try {
      const url = "/api/admin/certificates";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? JSON.stringify({ id: editingId, ...values }) : JSON.stringify(values);
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { showToast("error", json.error ?? "Failed to save"); return; }
      showToast("success", editingId ? "Certificate updated" : "Certificate created");
      closeForm();
      await load();
    } catch { showToast("error", "Network error"); }
    finally { setSaving(false); }
  };

  const onDelete = (id: string) => {
    confirm(
      "Delete certificate",
      "Are you sure you want to delete this certificate? This action cannot be undone.",
      async () => {
        setDeletingId(id);
        try {
          const res = await fetch(`/api/admin/certificates?id=${id}`, { method: "DELETE" });
          if (!res.ok) { const json = await res.json().catch(() => ({})); showToast("error", json.error ?? "Failed to delete"); return; }
          showToast("success", "Certificate deleted");
          await load();
        } catch { showToast("error", "Network error"); }
        finally { setDeletingId(null); }
      }
    );
  };

  const toggleActive = async (c: Certificate) => {
    try {
      const res = await fetch("/api/admin/certificates", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id, is_active: !c.is_active }) });
      if (!res.ok) { showToast("error", "Failed to update"); return; }
      showToast("success", c.is_active ? "Certificate deactivated" : "Certificate activated");
      await load();
    } catch { showToast("error", "Network error"); }
  };

  return (
    <div className="space-y-6">
      <Alerts />
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Content</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Certificates</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage certificates and registrations displayed on the website.</p>
        </div>
        {canCrud && (
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95">
            <Plus className="h-4 w-4" /> Add Certificate
          </button>
        )}
      </header>

      {showForm && canCrud && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{editingId ? "Edit Certificate" : "New Certificate"}</h2>
            <button type="button" onClick={closeForm} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Title</label>
              <input {...register("title")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="e.g. CAC Registration" />
              {errors.title && <p className="mt-1 text-xs font-semibold text-red-600">{errors.title.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Subtitle</label>
              <input {...register("subtitle")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="e.g. Corporate Affairs Commission" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Icon Emoji</label>
              <input {...register("icon_emoji")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="📜" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Sort Order</label>
              <input type="number" {...register("sort_order", { valueAsNumber: true })} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
            </div>
            <div className="sm:col-span-2">
              <FileUpload
                label="Certificate Image (optional)"
                value={watch("image_url") ?? ""}
                onChange={(url) => setValue("image_url", url)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Active (visible on website)</span>
              </label>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Update Certificate" : "Create Certificate"}
            </button>
            <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">Cancel</button>
          </div>
        </form>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <Award className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">All Certificates ({items.length})</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-slate-500" /></div>
        ) : items.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">No certificates yet. Add your first certificate above.</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((c, idx) => (
              <li key={c.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span className={`inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold ${c.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{idx + 1}</span>
                    <span className="text-2xl flex-none">{c.icon_emoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                        {!c.is_active && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Inactive</span>}
                      </div>
                      {c.subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{c.subtitle}</p>}
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-1">
                    {canCrud && (
                      <>
                        <button onClick={() => toggleActive(c)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300" title={c.is_active ? "Deactivate" : "Activate"}>
                          {c.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" title="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => onDelete(c.id)} disabled={deletingId === c.id} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-30 dark:hover:bg-red-900/30" title="Delete">
                          {deletingId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
