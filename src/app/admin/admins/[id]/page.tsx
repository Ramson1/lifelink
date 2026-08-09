"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save, KeyRound } from "lucide-react";
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

const updateSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.custom<AdminRole>((v) =>
    (ADMIN_ROLES as readonly string[]).includes(v as string),
  ),
});

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: z.string().min(6, "New password must be at least 6 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type UpdateForm = z.infer<typeof updateSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function AdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const { showToast, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const updateForm = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    values: admin
      ? {
          full_name: admin.full_name,
          email: admin.email,
          role: admin.role as AdminRole,
        }
      : undefined,
  });

  const pwdForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current: "", next: "", confirm: "" },
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/admins/${id}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to load admin");
        setLoading(false);
        return;
      }
      setAdmin(json.admin);
      setLoading(false);
    })();
  }, [id]);

  const onUpdate = async (values: UpdateForm) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/admins/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Update failed");
        return;
      }
      setAdmin(json.admin);
      showToast("success", "Changes saved successfully");
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const onPassword = async (values: PasswordForm) => {
    setPwdSaving(true);
    try {
      const res = await fetch(`/api/admin/admins/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: { current: values.current, next: values.next },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Failed to change password");
        return;
      }
      showToast("success", "Password updated successfully");
      pwdForm.reset();
    } catch {
      showToast("error", "Network error");
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Admin not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alerts />
      <div>
        <Link
          href="/admin/admins"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to admins
        </Link>
      </div>

      <header>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Admin
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {admin.full_name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {ROLE_LABELS[admin.role as AdminRole] ?? admin.role}
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {canCrud ? (
        <form
          onSubmit={updateForm.handleSubmit(onUpdate)}
          className="rounded-3xl border border-slate-200 bg-white p-6"
        >
          <h2 className="text-sm font-semibold text-slate-900">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Full name
              </label>
              <input
                {...updateForm.register("full_name")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {updateForm.formState.errors.full_name && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {updateForm.formState.errors.full_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                {...updateForm.register("email")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {updateForm.formState.errors.email && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {updateForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Role
              </label>
              <select
                {...updateForm.register("role")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {ADMIN_ROLES.filter((r) => r !== "super_admin").map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
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
          <h2 className="text-sm font-semibold text-slate-900">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold text-slate-500">Full name</div>
              <div className="mt-1 text-sm text-slate-900">{admin.full_name}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Email</div>
              <div className="mt-1 text-sm text-slate-900">{admin.email}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-slate-500">Role</div>
              <div className="mt-1 text-sm text-slate-900">{ROLE_LABELS[admin.role as AdminRole] ?? admin.role}</div>
            </div>
          </div>
        </div>
      )}

      {canCrud && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900">
                Change password
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setChangingPwd((v) => !v)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
            >
              {changingPwd ? "Close" : "Open"}
            </button>
          </div>

          {changingPwd && (
            <form
              onSubmit={pwdForm.handleSubmit(onPassword)}
              className="mt-4 grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Current password
                </label>
                <input
                  type="password"
                  {...pwdForm.register("current")}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  New password
                </label>
                <input
                  type="password"
                  {...pwdForm.register("next")}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Confirm new password
                </label>
                <input
                  type="password"
                  {...pwdForm.register("confirm")}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                {pwdForm.formState.errors.confirm && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {pwdForm.formState.errors.confirm.message}
                  </p>
                )}
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={pwdSaving}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {pwdSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="h-4 w-4" />
                  )}
                  Update password
                </button>
              </div>
            </form>
          )}
        </section>
      )}
    </div>
  );
}
