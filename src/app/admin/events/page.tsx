"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";

import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  event_date: z.string().optional(),
  image_url: z.string().optional(),
  is_upcoming: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0),
});

type Form = z.infer<typeof schema>;

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string | null;
  image_url: string;
  is_upcoming: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function EventsAdminPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showToast, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      event_date: "",
      image_url: "",
      is_upcoming: true,
      is_active: true,
      sort_order: 0,
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events?admin=true");
      const json = await res.json().catch(() => ({}));
      setItems(json.items ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    reset({ title: "", description: "", location: "", event_date: "", image_url: "", is_upcoming: true, is_active: true, sort_order: items.length });
    setShowForm(true);
  };

  const openEdit = (ev: EventItem) => {
    setEditingId(ev.id);
    reset({
      title: ev.title,
      description: ev.description,
      location: ev.location,
      event_date: ev.event_date ? ev.event_date.slice(0, 16) : "",
      image_url: ev.image_url,
      is_upcoming: ev.is_upcoming,
      is_active: ev.is_active,
      sort_order: ev.sort_order,
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const onSubmit = async (values: Form) => {
    setSaving(true);
    try {
      const payload = { ...values, event_date: values.event_date || null };
      const url = "/api/admin/events";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload);
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { showToast("error", json.error ?? "Failed to save"); return; }
      showToast("success", editingId ? "Event updated" : "Event created");
      closeForm();
      await load();
    } catch { showToast("error", "Network error"); }
    finally { setSaving(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      if (!res.ok) { const json = await res.json().catch(() => ({})); showToast("error", json.error ?? "Failed to delete"); return; }
      showToast("success", "Event deleted");
      await load();
    } catch { showToast("error", "Network error"); }
    finally { setDeletingId(null); }
  };

  const toggleActive = async (ev: EventItem) => {
    try {
      const res = await fetch("/api/admin/events", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: ev.id, is_active: !ev.is_active }) });
      if (!res.ok) { showToast("error", "Failed to update"); return; }
      showToast("success", ev.is_active ? "Event deactivated" : "Event activated");
      await load();
    } catch { showToast("error", "Network error"); }
  };

  return (
    <div className="space-y-6">
      <Alerts />
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Content</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Events</h1>
          <p className="mt-1 text-sm text-slate-600">Manage events and programs displayed on the website.</p>
        </div>
        {canCrud && (
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95">
            <Plus className="h-4 w-4" /> Add Event
          </button>
        )}
      </header>

      {showForm && canCrud && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">{editingId ? "Edit Event" : "New Event"}</h2>
            <button type="button" onClick={closeForm} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">Title</label>
              <input {...register("title")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              {errors.title && <p className="mt-1 text-xs font-semibold text-red-600">{errors.title.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">Description</label>
              <textarea rows={3} {...register("description")} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Location</label>
              <input {...register("location")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Port Harcourt" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Event Date & Time</label>
              <input type="datetime-local" {...register("event_date")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">Image URL</label>
              <input {...register("image_url")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" placeholder="/images/event.jpg" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Sort Order</label>
              <input type="number" {...register("sort_order", { valueAsNumber: true })} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" {...register("is_upcoming")} className="h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-semibold text-slate-700">Upcoming event</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" {...register("is_active")} className="h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-semibold text-slate-700">Active (visible)</span>
              </label>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Update Event" : "Create Event"}
            </button>
            <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Cancel</button>
          </div>
        </form>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <CalendarDays className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">All Events ({items.length})</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-slate-500" /></div>
        ) : items.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">No events yet. Create your first event above.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((ev) => (
              <li key={ev.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{ev.title}</h3>
                      {ev.is_upcoming && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Upcoming</span>}
                      {!ev.is_active && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Inactive</span>}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      {ev.location && <span>{ev.location}</span>}
                      {ev.event_date && <span>{new Date(ev.event_date).toLocaleDateString()} {new Date(ev.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
                    </div>
                    {ev.description && <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">{ev.description}</p>}
                  </div>
                  <div className="flex flex-none items-center gap-1">
                    {canCrud && (
                      <>
                        <button onClick={() => toggleActive(ev)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title={ev.is_active ? "Deactivate" : "Activate"}>
                          {ev.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button onClick={() => openEdit(ev)} className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50" title="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => onDelete(ev.id)} disabled={deletingId === ev.id} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-30" title="Delete">
                          {deletingId === ev.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
