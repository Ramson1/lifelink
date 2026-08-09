import Link from "next/link";
import {
  UserCog,
  Users,
  MessageSquare,
  ScrollText,
  ArrowRight,
} from "lucide-react";

import { createServiceClient } from "@/lib/admin/supabase";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = createServiceClient();
  const [admins, users, messages, audit] = await Promise.all([
    supabase
      .from("lifelink_admins")
      .select("id", { count: "exact", head: true })
      .eq("is_super_admin", false),
    supabase.from("lifelink_users").select("id", { count: "exact", head: true }),
    supabase.from("lifelink_messages").select("id", { count: "exact", head: true }),
    supabase
      .from("lifelink_audit_logs")
      .select("id, admin_email, action, entity_type, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);
  return {
    adminCount: admins.count ?? 0,
    userCount: users.count ?? 0,
    messageCount: messages.count ?? 0,
    recentAudit: audit.data ?? [],
  };
}

export default async function AdminOverviewPage() {
  const { adminCount, userCount, messageCount, recentAudit } =
    await getCounts();

  const stats = [
    {
      label: "Admins",
      value: adminCount,
      icon: UserCog,
      href: "/admin/admins",
      gradient: "from-indigo-500 to-cyan-500",
    },
    {
      label: "Registered users",
      value: userCount,
      icon: Users,
      href: "/admin/users",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Messages",
      value: messageCount,
      icon: MessageSquare,
      href: "/admin/messages",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Dashboard
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Overview
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Quick snapshot of activity across the LifeLink admin platform.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition hover:shadow-lg"
            >
              <div
                className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 transition group-hover:opacity-20`}
              />
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-3xl font-bold text-slate-900">
                {s.value}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                {s.label}
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:gap-2">
                View <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900">
              Recent activity
            </h2>
          </div>
          <Link
            href="/admin/audit"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentAudit.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No activity yet.
            </div>
          )}
          {recentAudit.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-4 px-6 py-3 text-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-semibold text-slate-800">
                  {entry.action}
                </div>
                <div className="truncate text-xs text-slate-500">
                  by {entry.admin_email}
                  {entry.entity_type ? ` · ${entry.entity_type}` : ""}
                </div>
              </div>
              <div className="text-xs text-slate-400">
                {new Date(entry.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
