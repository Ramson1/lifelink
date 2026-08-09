"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Bell,
  Send,
  Loader2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import { services } from "@/lib/brand";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

const schema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Message is required").max(10000),
  recipient_mode: z.enum(["all", "selected"]),
  user_ids: z.array(z.string().uuid()).min(1, "Select at least one user"),
  sector_filter: z.string().optional(),
});

type Form = z.infer<typeof schema>;

interface User {
  id: string;
  full_name: string;
  email: string;
  service_key: string;
}

interface Notification {
  id: string;
  subject: string;
  body: string;
  recipient_mode: string;
  created_at: string;
  admins?: { full_name: string; email: string };
}

export default function NotificationsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [history, setHistory] = useState<Notification[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState("");
  const { showToast, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "",
      body: "",
      recipient_mode: "all",
      user_ids: [],
      sector_filter: "",
    },
  });

  const recipientMode = form.watch("recipient_mode");

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users?pageSize=1000");
      const json = await res.json().catch(() => ({}));
      setUsers(json.users ?? []);
    } catch {
      // ignore
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const json = await res.json().catch(() => ({}));
      setHistory(json.notifications ?? []);
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadHistory();
  }, []);

  const filteredUsers = users.filter((u) =>
    sectorFilter ? u.service_key === sectorFilter : true,
  );

  const toggleUser = (id: string) => {
    const current = form.getValues("user_ids") ?? [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    form.setValue("user_ids", next, { shouldValidate: true });
  };

  const selectAllFiltered = () => {
    form.setValue(
      "user_ids",
      filteredUsers.map((u) => u.id),
      { shouldValidate: true },
    );
  };

  const onSend = async (values: Form) => {
    setSending(true);
    setError(null);
    try {
      const payload = {
        subject: values.subject,
        body: values.body,
        recipient_mode: values.recipient_mode,
        user_ids: values.recipient_mode === "selected" ? values.user_ids : [],
      };
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Failed to send");
        return;
      }
      showToast(
        "success",
        `Notification sent to ${json.sent_count} recipient${json.sent_count === 1 ? "" : "s"}.`,
      );
      form.reset({
        subject: "",
        body: "",
        recipient_mode: "all",
        user_ids: [],
      });
      await loadHistory();
    } catch {
      showToast("error", "Network error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alerts />
      <header>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Communication
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Send email notifications to registered users.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {canCrud && (
        <form
          onSubmit={form.handleSubmit(onSend)}
          className="rounded-3xl border border-slate-200 bg-white p-6"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Compose notification
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Subject
              </label>
              <input
                {...form.register("subject")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {form.formState.errors.subject && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Recipients
              </label>
              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                  <input
                    type="radio"
                    value="all"
                    {...form.register("recipient_mode")}
                    className="h-4 w-4"
                  />
                  All users
                </label>
                <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                  <input
                    type="radio"
                    value="selected"
                    {...form.register("recipient_mode")}
                    className="h-4 w-4"
                  />
                  Selected users
                </label>
              </div>
            </div>

            {recipientMode === "selected" && (
              <div className="sm:col-span-2">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">All sectors</option>
                    {services.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Select all filtered ({filteredUsers.length})
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-500">
                      No users.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {filteredUsers.map((u) => {
                        const selected = form
                          .watch("user_ids")
                          ?.includes(u.id);
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => toggleUser(u.id)}
                            className={[
                              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                              selected
                                ? "border-indigo-500 bg-indigo-500 text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
                            ].join(" ")}
                          >
                            {u.full_name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {form.formState.errors.user_ids && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {form.formState.errors.user_ids.message}
                  </p>
                )}
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Message
              </label>
              <textarea
                rows={6}
                {...form.register("body")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {form.formState.errors.body && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {form.formState.errors.body.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send notification
            </button>
          </div>
        </form>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <Bell className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">
            Notification history
          </h2>
        </div>
        {loadingHistory ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : history.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No notifications sent yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {history.map((n) => (
              <li key={n.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {n.subject}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      by {n.admins?.full_name ?? "Unknown"} ·{" "}
                      {n.recipient_mode === "all"
                        ? "All users"
                        : "Selected users"}{" "}
                      · {new Date(n.created_at).toLocaleString()}
                    </div>
                    <div className="mt-2 line-clamp-2 text-xs text-slate-600">
                      {n.body}
                    </div>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    {n.recipient_mode}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
