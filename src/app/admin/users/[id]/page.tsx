"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { services } from "@/lib/brand";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

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
  created_at: string;
}

const schema = z.object({
  full_name: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(5, "Required"),
  address: z.string().min(1, "Required"),
  occupation: z.string().optional(),
  next_of_kin_name: z.string().optional(),
  next_of_kin_phone: z.string().optional(),
  service_key: z.string().min(1),
  notes: z.string().optional(),
  status: z.string().min(1),
});

type Form = z.infer<typeof schema>;

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast, confirm, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    values: user
      ? {
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          occupation: user.occupation,
          next_of_kin_name: user.next_of_kin_name,
          next_of_kin_phone: user.next_of_kin_phone,
          service_key: user.service_key,
          notes: user.notes,
          status: user.status,
        }
      : undefined,
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/users/${id}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to load user");
        setLoading(false);
        return;
      }
      setUser(json.user);
      setLoading(false);
    })();
  }, [id]);

  const onSave = async (values: Form) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Update failed");
        return;
      }
      setUser(json.user);
      showToast("success", "Changes saved successfully");
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = () => {
    if (!user) return;
    confirm(
      "Delete user",
      `Are you sure you want to delete "${user.full_name}"? This action cannot be undone.`,
      async () => {
        const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        if (!res.ok) {
          showToast("error", "Failed to delete");
          return;
        }
        showToast("success", `User "${user.full_name}" deleted successfully`);
        router.push("/admin/users");
      },
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alerts />
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to users
        </Link>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            User
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {user.full_name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {services.find((s) => s.key === user.service_key)?.title ??
              user.service_key}{" "}
            · {user.status} · Registered {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
        {canCrud && (
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete user
          </button>
        )}
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {canCrud ? (
        <form
          onSubmit={form.handleSubmit(onSave)}
          className="rounded-3xl border border-slate-200 bg-white p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Full name
              </label>
              <input
                {...form.register("full_name")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                {...form.register("email")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Phone
              </label>
              <input
                {...form.register("phone")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Address
              </label>
              <input
                {...form.register("address")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Sector
              </label>
              <select
                {...form.register("service_key")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {services.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Occupation
              </label>
              <input
                {...form.register("occupation")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Status
              </label>
              <select
                {...form.register("status")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Next of kin name
              </label>
              <input
                {...form.register("next_of_kin_name")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Next of kin phone
              </label>
              <input
                {...form.register("next_of_kin_phone")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Notes
              </label>
              <textarea
                rows={3}
                {...form.register("notes")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save changes
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">User details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-xs font-semibold text-slate-500">Full name</div>
              <div className="mt-1 text-sm text-slate-900">{user.full_name}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Email</div>
              <div className="mt-1 text-sm text-slate-900">{user.email}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Phone</div>
              <div className="mt-1 text-sm text-slate-900">{user.phone}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-slate-500">Address</div>
              <div className="mt-1 text-sm text-slate-900">{user.address}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Sector</div>
              <div className="mt-1 text-sm text-slate-900">{services.find((s) => s.key === user.service_key)?.title ?? user.service_key}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Occupation</div>
              <div className="mt-1 text-sm text-slate-900">{user.occupation || "—"}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Status</div>
              <div className="mt-1 text-sm text-slate-900 capitalize">{user.status}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Next of kin name</div>
              <div className="mt-1 text-sm text-slate-900">{user.next_of_kin_name || "—"}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Next of kin phone</div>
              <div className="mt-1 text-sm text-slate-900">{user.next_of_kin_phone || "—"}</div>
            </div>
            {user.notes && (
              <div className="sm:col-span-2 lg:col-span-3">
                <div className="text-xs font-semibold text-slate-500">Notes</div>
                <div className="mt-1 text-sm text-slate-900">{user.notes}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
