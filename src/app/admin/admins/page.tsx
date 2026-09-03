"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Loader2,
  Trash2,
  Pencil,
  Search,
  UserCog,
  X,
  Upload,
  Download,
} from "lucide-react";
import Link from "next/link";

import { ADMIN_ROLES, ROLE_LABELS, type AdminRole } from "@/lib/admin/roles";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

const createSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(1, "Full name is required"),
  role: z.custom<AdminRole>((v) =>
    (ADMIN_ROLES as readonly string[]).includes(v as string),
  ),
});

type CreateForm = z.infer<typeof createSchema>;

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const { showToast, confirm, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "chairman",
    },
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins");
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to load admins");
        return;
      }
      setAdmins(json.admins ?? []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (values: CreateForm) => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Failed to create admin");
        return;
      }
      reset();
      setShowCreate(false);
      showToast("success", `Admin "${values.full_name}" created successfully`);
      await load();
    } catch {
      showToast("error", "Network error");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = (id: string, email: string) => {
    confirm(
      "Delete admin",
      `Are you sure you want to delete admin ${email}? This action cannot be undone.`,
      async () => {
        setDeletingId(id);
        try {
          const res = await fetch(`/api/admin/admins?id=${id}`, {
            method: "DELETE",
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            showToast("error", json.error ?? "Failed to delete admin");
            return;
          }
          showToast("success", `Admin ${email} deleted successfully`);
          await load();
        } catch {
          showToast("error", "Network error");
        } finally {
          setDeletingId(null);
        }
      },
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return admins;
    return admins.filter(
      (a) =>
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (ROLE_LABELS[a.role as AdminRole] ?? a.role)
          .toLowerCase()
          .includes(q),
    );
  }, [admins, query]);

  const allowedRoles = ADMIN_ROLES.filter((r) => r !== "super_admin");

  const downloadTemplate = () => {
    const headers = "full_name,email,password,role";
    const sampleRow = `Jane Smith,jane@example.com,SecurePass123,${allowedRoles[0] ?? "chairman"}`;
    const csv = [headers, sampleRow].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admins_bulk_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onBulkImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[type="file"]') as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    setBulkImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/admins/bulk", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Bulk import failed");
        return;
      }
      showToast("success", `${json.imported} admin${json.imported === 1 ? "" : "s"} imported successfully`);
      if (json.skipped > 0) {
        showToast("error", `${json.skipped} admin${json.skipped === 1 ? "" : "s"} skipped (email already exists)`);
      }
      if (json.errors?.length > 0) {
        showToast("error", `${json.errors.length} row${json.errors.length === 1 ? "" : "s"} had errors`);
      }
      setShowBulk(false);
      await load();
    } catch {
      showToast("error", "Network error");
    } finally {
      setBulkImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alerts />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Administration
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admins
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage the team that operates the LifeLink platform.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canCrud && (
            <button
              onClick={() => setShowBulk((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              {showBulk ? <X className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              {showBulk ? "Close" : "Bulk import"}
            </button>
          )}
          {canCrud && (
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
            >
              {showCreate ? (
                <>
                  <X className="h-4 w-4" /> Close
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add admin
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {showBulk && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Bulk import admins
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Download the template, fill in your data, then upload the CSV file. Required columns: full_name, email, password (min 6 chars), role ({allowedRoles.join(", ")}).
          </p>
          <button
            type="button"
            onClick={downloadTemplate}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            <Download className="h-3.5 w-3.5" /> Download template
          </button>
          <form onSubmit={onBulkImport} className="mt-4">
            <input
              type="file"
              accept=".csv"
              required
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
            />
            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={bulkImporting}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {bulkImporting && <Loader2 className="h-4 w-4 animate-spin" />}
                Import admins
              </button>
            </div>
          </form>
        </div>
      )}

      {showCreate && (
        <form
          onSubmit={handleSubmit(onCreate)}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Create a new admin
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full name
              </label>
              <input
                {...register("full_name")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.full_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.email && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.password && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Role
              </label>
              <select
                {...register("role")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              >
                {ADMIN_ROLES.filter((r) => r !== "super_admin").map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create admin
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                reset();
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <UserCog className="h-4 w-4 text-slate-500" />
            {admins.length} admin{admins.length === 1 ? "" : "s"}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search admins"
              className="h-9 w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            No admins found.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-semibold text-white">
                    {a.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {a.full_name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{a.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {ROLE_LABELS[a.role as AdminRole] ?? a.role}
                  </span>
                  {canCrud && (
                    <Link
                      href={`/admin/admins/${a.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  )}
                  {canCrud && (
                    <button
                      onClick={() => onDelete(a.id, a.email)}
                      disabled={deletingId === a.id}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      {deletingId === a.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Delete
                    </button>
                  )}
                  {!canCrud && (
                    <Link
                      href={`/admin/admins/${a.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                      View
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
