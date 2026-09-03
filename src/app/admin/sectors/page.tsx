"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

interface Sector {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color_from: string;
  color_to: string;
  tagline: string;
  overview: Array<{ title?: string; description?: string }>;
  features: Array<{ title: string; description: string }>;
  benefits: string[];
  is_active: boolean;
  accepting_registrations: boolean;
  created_at: string;
  updated_at: string;
}

const emptySector = {
  key: "",
  title: "",
  subtitle: "",
  description: "",
  icon: "Star",
  color_from: "#6366f1",
  color_to: "#4f46e5",
  tagline: "",
  overview: [] as Array<{ title?: string; description?: string }>,
  features: [] as Array<{ title: string; description: string }>,
  benefits: [] as string[],
  is_active: true,
  accepting_registrations: false,
};

export default function SectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Sector | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptySector);
  const { showToast, confirm, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sectors?admin=true");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSectors(json.items ?? []);
    } catch (e: any) {
      showToast("error", e.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm(emptySector);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (s: Sector) => {
    setForm({
      key: s.key,
      title: s.title,
      subtitle: s.subtitle,
      description: s.description,
      icon: s.icon,
      color_from: s.color_from,
      color_to: s.color_to,
      tagline: s.tagline,
      overview: s.overview ?? [],
      features: s.features ?? [],
      benefits: s.benefits ?? [],
      is_active: s.is_active,
      accepting_registrations: s.accepting_registrations,
    });
    setEditing(s);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.key || !form.title) {
      showToast("error", "Key and Title are required");
      return;
    }
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch("/api/admin/sectors", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed");
      showToast("success", editing ? "Sector updated" : "Sector created");
      setShowForm(false);
      await load();
    } catch (e: any) {
      showToast("error", e.message ?? "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    confirm(
      "Delete sector",
      "Are you sure you want to delete this sector? This action cannot be undone.",
      async () => {
        try {
          const res = await fetch(`/api/admin/sectors?id=${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed");
          showToast("success", "Sector deleted");
          await load();
        } catch {
          showToast("error", "Failed to delete");
        }
      }
    );
  };

  // Dynamic list helpers
  const addOverviewItem = () => setForm(f => ({ ...f, overview: [...f.overview, { title: "", description: "" }] }));
  const removeOverviewItem = (i: number) => setForm(f => ({ ...f, overview: f.overview.filter((_, idx) => idx !== i) }));
  const updateOverviewItem = (i: number, field: string, val: string) =>
    setForm(f => ({ ...f, overview: f.overview.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  const addFeature = () => setForm(f => ({ ...f, features: [...f.features, { title: "", description: "" }] }));
  const removeFeature = (i: number) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  const updateFeature = (i: number, field: string, val: string) =>
    setForm(f => ({ ...f, features: f.features.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  const addBenefit = () => setForm(f => ({ ...f, benefits: [...f.benefits, ""] }));
  const removeBenefit = (i: number) => setForm(f => ({ ...f, benefits: f.benefits.filter((_, idx) => idx !== i) }));
  const updateBenefit = (i: number, val: string) =>
    setForm(f => ({ ...f, benefits: f.benefits.map((b, idx) => idx === i ? val : b) }));

  return (
    <div className="space-y-6">
      <Alerts />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Admin</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sectors</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage all 14 LifeLink sectors — control content, active status, and registration availability. Changes are reflected immediately across the site.</p>
        </div>
        {canCrud && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Add sector
          </button>
        )}
      </header>

      {/* Form */}
      {showForm && canCrud && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{editing ? "Edit sector" : "New sector"}</h2>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Key (unique slug)</label>
              <input value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="e.g. renewable-energy" disabled={!!editing} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="e.g. Renewable Energy" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subtitle</label>
              <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Icon (Lucide name)</label>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="e.g. Leaf" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Color From</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color_from} onChange={e => setForm(f => ({ ...f, color_from: e.target.value }))} className="h-10 w-10 cursor-pointer rounded-lg border border-slate-200" />
                <input value={form.color_from} onChange={e => setForm(f => ({ ...f, color_from: e.target.value }))} className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Color To</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color_to} onChange={e => setForm(f => ({ ...f, color_to: e.target.value }))} className="h-10 w-10 cursor-pointer rounded-lg border border-slate-200" />
                <input value={form.color_to} onChange={e => setForm(f => ({ ...f, color_to: e.target.value }))} className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tagline</label>
            <textarea rows={2} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={form.accepting_registrations} onChange={e => setForm(f => ({ ...f, accepting_registrations: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              Accepting registrations
            </label>
          </div>

          {/* Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Overview paragraphs</label>
              <button type="button" onClick={addOverviewItem} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">+ Add</button>
            </div>
            {form.overview.map((item, i) => (
              <div key={i} className="flex gap-2">
                <textarea rows={2} value={item.description ?? ""} onChange={e => updateOverviewItem(i, "description", e.target.value)} className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="Paragraph text" />
                <button type="button" onClick={() => removeOverviewItem(i)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Features</label>
              <button type="button" onClick={addFeature} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">+ Add</button>
            </div>
            {form.features.map((f, i) => (
              <div key={i} className="flex gap-2 rounded-xl border border-slate-100 p-3">
                <div className="flex-1 space-y-2">
                  <input value={f.title} onChange={e => updateFeature(i, "title", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="Feature title" />
                  <textarea rows={2} value={f.description} onChange={e => updateFeature(i, "description", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="Feature description" />
                </div>
                <button type="button" onClick={() => removeFeature(i)} className="self-start rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Benefits</label>
              <button type="button" onClick={addBenefit} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">+ Add</button>
            </div>
            {form.benefits.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input value={b} onChange={e => updateBenefit(i, e.target.value)} className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white" placeholder="Benefit text" />
                <button type="button" onClick={() => removeBenefit(i)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editing ? "Update sector" : "Create sector"}
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">All Sectors ({sectors.length})</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : sectors.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No sectors found. Run the seed migration or create one to get started.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {sectors.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{s.title}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-500">{s.key}</span>
                    {s.is_active && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>}
                    {s.accepting_registrations && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">Open</span>}
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{s.subtitle || s.description}</div>
                </div>
                {canCrud && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(s)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
