"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Upload,
  Download,
  Eye,
} from "lucide-react";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { services } from "@/lib/brand";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  next_of_kin_name: string;
  next_of_kin_phone: string;
  service_key: string;
  notes: string;
  status: string;
  source: string;
  passport_url: string;
  created_at: string;
}

const createSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(5, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  occupation: z.string().optional(),
  service_key: z.string().min(1, "Sector is required"),
  notes: z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const pageSize = 25;
  const { showToast, confirm, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      occupation: "",
      service_key: services[0]?.key ?? "",
      notes: "",
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (query.trim()) params.set("q", query.trim());
      if (sectorFilter) params.set("service_key", sectorFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to load users");
        return;
      }
      setUsers(json.users ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [page, query, sectorFilter, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (values: CreateForm) => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Failed to create user");
        return;
      }
      createForm.reset();
      setShowCreate(false);
      showToast("success", `User "${values.full_name}" created successfully`);
      await load();
    } catch {
      showToast("error", "Network error");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = (id: string, name: string) => {
    confirm(
      "Delete user",
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      async () => {
        setDeletingId(id);
        try {
          const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            showToast("error", json.error ?? "Failed to delete user");
            return;
          }
          showToast("success", `User "${name}" deleted successfully`);
          await load();
        } catch {
          showToast("error", "Network error");
        } finally {
          setDeletingId(null);
        }
      },
    );
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const sectorLabel = (key: string) =>
    services.find((s) => s.key === key)?.title ?? key;

  const downloadTemplate = () => {
    const headers = "full_name,email,phone,address,occupation,service_key,next_of_kin_name,next_of_kin_phone,notes";
    const sampleRow = `John Doe,john@example.com,+2348012345678,"123 Main Street, Lagos",Software Engineer,${services[0]?.key ?? "humanitarian"},Jane Doe,+2348098765432,Optional notes`;
    const csv = [headers, sampleRow].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_bulk_import_template.csv";
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
      const res = await fetch("/api/admin/users/bulk", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Bulk import failed");
        return;
      }
      showToast("success", `${json.imported} user${json.imported === 1 ? "" : "s"} imported successfully`);
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

  const exportToCsv = () => {
    const headers = ["full_name", "email", "phone", "address", "occupation", "service_key", "next_of_kin_name", "next_of_kin_phone", "notes", "status", "source", "created_at"];
    const rows = users.map((u) => [
      `"${u.full_name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.phone}"`,
      `"${u.address.replace(/"/g, '""')}"`,
      `"${u.occupation.replace(/"/g, '""')}"`,
      `"${u.service_key}"`,
      `"${u.next_of_kin_name.replace(/"/g, '""')}"`,
      `"${u.next_of_kin_phone}"`,
      `"${(u.notes ?? "").replace(/"/g, '""')}"`,
      `"${u.status}"`,
      `"${u.source}"`,
      `"${u.created_at}"`,
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            Users
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Registered users across all LifeLink sectors.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportToCsv}
            disabled={users.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
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
                  <Plus className="h-4 w-4" /> Add user
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {showBulk && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Bulk import users
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Download the template, fill in your data, then upload the CSV file. Required columns: full_name, email, phone, address, service_key.
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
                Import users
              </button>
            </div>
          </form>
        </div>
      )}

      {showCreate && (
        <form
          onSubmit={createForm.handleSubmit(onCreate)}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Register a new user
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full name
              </label>
              <input
                {...createForm.register("full_name")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {createForm.formState.errors.full_name && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {createForm.formState.errors.full_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                {...createForm.register("email")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone
              </label>
              <input
                {...createForm.register("phone")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Address
              </label>
              <input
                {...createForm.register("address")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sector
              </label>
              <select
                {...createForm.register("service_key")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              >
                {services.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Occupation
              </label>
              <input
                {...createForm.register("occupation")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Notes
              </label>
              <textarea
                rows={2}
                {...createForm.register("notes")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create user
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                createForm.reset();
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Users className="h-4 w-4 text-slate-500" />
            {total} registered user{total === 1 ? "" : "s"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search users"
                className="h-9 w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 dark:border-slate-600 dark:bg-slate-900">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={sectorFilter}
                onChange={(e) => {
                  setSectorFilter(e.target.value);
                  setPage(1);
                }}
                className="h-8 border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white"
              >
                <option value="">All sectors</option>
                {services.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No users found.
          </div>
        ) : (
          <>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex cursor-pointer flex-wrap items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  onClick={() => setSelectedUser(u)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {u.passport_url ? (
                      <img
                        src={u.passport_url}
                        alt={u.full_name}
                        className="h-10 w-10 flex-none rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white">
                        {u.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 leading-tight">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {u.full_name}
                      </div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {u.email} · {u.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {sectorLabel(u.service_key)}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {u.status}
                    </span>
                    {canCrud && (
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                    )}
                    {canCrud && (
                      <button
                        onClick={() => onDelete(u.id, u.full_name)}
                        disabled={deletingId === u.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:bg-slate-700 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        {deletingId === u.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                    {!canCrud && (
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 text-sm dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedUser(null)}>
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {selectedUser.passport_url ? (
                  <img
                    src={selectedUser.passport_url}
                    alt={selectedUser.full_name}
                    className="h-16 w-16 flex-none rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xl font-semibold text-white">
                    {selectedUser.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedUser.full_name}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Phone</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedUser.phone}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Occupation</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedUser.occupation || "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sector</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {sectorLabel(selectedUser.service_key)}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Status</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedUser.status}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:col-span-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Address</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedUser.address || "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Next of Kin</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedUser.next_of_kin_name || "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Next of Kin Phone</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedUser.next_of_kin_phone || "—"}
                </div>
              </div>
              {selectedUser.notes && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Notes</div>
                  <div className="mt-1 text-sm leading-6 text-slate-900 dark:text-white">
                    {selectedUser.notes}
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Source</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedUser.source}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Registered</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {canCrud && (
                <Link
                  href={`/admin/users/${selectedUser.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <Pencil className="h-4 w-4" /> Edit user
                </Link>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
