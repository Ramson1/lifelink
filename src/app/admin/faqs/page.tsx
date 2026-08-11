"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";

import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

const schema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().min(1, "Category is required"),
  sort_order: z.number().int().min(0),
  is_published: z.boolean(),
});

type Form = z.infer<typeof schema>;

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "registration", label: "Registration" },
  { value: "services", label: "Services" },
  { value: "contact", label: "Contact" },
  { value: "payment", label: "Payment" },
  { value: "account", label: "Account" },
];

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
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
      question: "",
      answer: "",
      category: "general",
      sort_order: 0,
      is_published: true,
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs?admin=true");
      const json = await res.json().catch(() => ({}));
      setFaqs(json.items ?? []);
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
      question: "",
      answer: "",
      category: "general",
      sort_order: faqs.length,
      is_published: true,
    });
    setShowForm(true);
  };

  const openEdit = (faq: Faq) => {
    setEditingId(faq.id);
    reset({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_published: faq.is_published,
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
      const url = "/api/admin/faqs";
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
        editingId ? "FAQ updated" : "FAQ created",
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
    if (!confirm("Delete this FAQ?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        showToast("error", json.error ?? "Failed to delete");
        return;
      }
      showToast("success", "FAQ deleted");
      await load();
    } catch {
      showToast("error", "Network error");
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublished = async (faq: Faq) => {
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: faq.id, is_published: !faq.is_published }),
      });
      if (!res.ok) {
        showToast("error", "Failed to update");
        return;
      }
      showToast(
        "success",
        faq.is_published ? "FAQ unpublished" : "FAQ published",
      );
      await load();
    } catch {
      showToast("error", "Network error");
    }
  };

  const moveOrder = async (faq: Faq, direction: "up" | "down") => {
    const idx = faqs.findIndex((f) => f.id === faq.id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= faqs.length) return;

    const other = faqs[swapIdx];
    const oldOrder = faq.sort_order;
    const newOrder = other.sort_order;

    try {
      await Promise.all([
        fetch("/api/admin/faqs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: faq.id, sort_order: newOrder }),
        }),
        fetch("/api/admin/faqs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: other.id, sort_order: oldOrder }),
        }),
      ]);
      await load();
    } catch {
      showToast("error", "Failed to reorder");
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
            FAQs
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage frequently asked questions displayed on the website.
          </p>
        </div>
        {canCrud && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
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
              {editingId ? "Edit FAQ" : "New FAQ"}
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
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Question
              </label>
              <input
                {...register("question")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.question && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.question.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Answer
              </label>
              <textarea
                rows={4}
                {...register("answer")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.answer && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.answer.message}
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

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Sort order
              </label>
              <input
                type="number"
                {...register("sort_order", { valueAsNumber: true })}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("is_published")}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Published (visible on website)
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
              {editingId ? "Update FAQ" : "Create FAQ"}
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

      {/* FAQ list */}
      <section className="rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <HelpCircle className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">
            All FAQs ({faqs.length})
          </h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No FAQs yet. Create your first FAQ above.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <li key={faq.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold",
                          faq.is_published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {faq.question}
                      </h3>
                      {!faq.is_published && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="rounded-full border border-slate-200 px-2 py-0.5 font-semibold">
                        {categoryLabel(faq.category)}
                      </span>
                      <span>Order: {faq.sort_order}</span>
                      <span>
                        Updated: {new Date(faq.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-none items-center gap-1">
                    {canCrud && (
                      <>
                        <button
                          onClick={() => moveOrder(faq, "up")}
                          disabled={idx === 0}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveOrder(faq, "down")}
                          disabled={idx === faqs.length - 1}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => togglePublished(faq)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          title={faq.is_published ? "Unpublish" : "Publish"}
                        >
                          {faq.is_published ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(faq)}
                          className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(faq.id)}
                          disabled={deletingId === faq.id}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-30"
                          title="Delete"
                        >
                          {deletingId === faq.id ? (
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
