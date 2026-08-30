"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Handshake,
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
  name: z.string().min(1, "Name is required"),
  logo_url: z.string().min(1, "Logo URL is required"),
  website_url: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type Form = z.infer<typeof schema>;

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: "partner", label: "Partner" },
  { value: "sponsor", label: "Sponsor" },
  { value: "affiliate", label: "Affiliate" },
  { value: "government", label: "Government" },
  { value: "ngo", label: "NGO" },
];

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
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
      name: "",
      logo_url: "",
      website_url: "",
      category: "partner",
      sort_order: 0,
      is_active: true,
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/partners?admin=true");
      const json = await res.json().catch(() => ({}));
      setPartners(json.items ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    reset({
      name: "",
      logo_url: "",
      website_url: "",
      category: "partner",
      sort_order: partners.length,
      is_active: true,
    });
    setShowForm(true);
  };

  const openEdit = (partner: Partner) => {
    setEditingId(partner.id);
    reset({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url,
      category: partner.category,
      sort_order: partner.sort_order,
      is_active: partner.is_active,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const onSubmit = async (values: Form) => {
    setSaving(true);
    try {
      const url = "/api/admin/partners";
      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? JSON.stringify({ id: editingId, ...values })
        : JSON.stringify(values);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Failed to save");
        return;
      }
      showToast(
        "success",
        editingId ? "Partner updated" : "Partner created",
      );
      closeForm();
      await load();
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        showToast("error", json.error ?? "Failed to delete");
        return;
      }
      showToast("success", "Partner deleted");
      await load();
    } catch {
      showToast("error", "Network error");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (partner: Partner) => {
    try {
      const res = await fetch("/api/admin/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: partner.id, is_active: !partner.is_active }),
      });
      if (!res.ok) {
        showToast("error", "Failed to update");
        return;
      }
      showToast(
        "success",
        partner.is_active ? "Partner deactivated" : "Partner activated",
      );
      await load();
    } catch {
      showToast("error", "Network error");
    }
  };

  const categoryLabel = (val: string) =>
    CATEGORIES.find((c) => c.value === val)?.label ?? val;

  return (
    <div className="space-y-6">
      <Alerts />
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Content
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Partners
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage partner logos and information displayed on the website.
          </p>
        </div>
        {canCrud && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add Partner
          </button>
        )}
      </header>

      {/* Create / Edit form */}
      {showForm && canCrud && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              {editingId ? "Edit Partner" : "New Partner"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Partner Name
              </label>
              <input
                {...register("name")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="e.g. Beaucia"
              />
              {errors.name && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Category
              </label>
              <select
                {...register("category")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Logo URL
              </label>
              <input
                {...register("logo_url")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="/trust/beautcia.png"
              />
              {errors.logo_url && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.logo_url.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Website URL (optional)
              </label>
              <input
                {...register("website_url")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Sort Order
              </label>
              <input
                type="number"
                {...register("sort_order", { valueAsNumber: true })}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Active (visible on website)
                </span>
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingId ? "Update Partner" : "Create Partner"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Partner list */}
      <section className="rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <Handshake className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">
            All Partners ({partners.length})
          </h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : partners.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No partners yet. Add your first partner above.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {partners.map((partner, idx) => (
              <li key={partner.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span
                      className={[
                        "inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold",
                        partner.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >
                      {idx + 1}
                    </span>
                    {partner.logo_url && (
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="h-10 w-10 flex-none rounded-lg object-contain border border-slate-200"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {partner.name}
                        </h3>
                        {!partner.is_active && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="rounded-full border border-slate-200 px-2 py-0.5 font-semibold">
                          {categoryLabel(partner.category)}
                        </span>
                        {partner.website_url && (
                          <span className="truncate">{partner.website_url}</span>
                        )}
                        <span>Order: {partner.sort_order}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-none items-center gap-1">
                    {canCrud && (
                      <>
                        <button
                          onClick={() => toggleActive(partner)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          title={partner.is_active ? "Deactivate" : "Activate"}
                        >
                          {partner.is_active ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(partner)}
                          className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(partner.id)}
                          disabled={deletingId === partner.id}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-30"
                          title="Delete"
                        >
                          {deletingId === partner.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
