"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  MessageSquare,
  Bell,
  ScrollText,
  LogOut,
  Loader2,
  Menu,
  X,
  ChevronLeft,
  KeyRound,
  HelpCircle,
  ArrowLeft,
  Layers,
  Handshake,
  CalendarDays,
  Award,
  ImageIcon,
  DatabaseBackup,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_super_admin: boolean;
}

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { href: "/admin/admins", label: "Admins", icon: UserCog },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/audit", label: "Audit Logs", icon: ScrollText },
  { href: "/admin/sectors", label: "Sectors", icon: Layers },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/backup", label: "Backup & Restore", icon: DatabaseBackup },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setLoading(false);
      return;
    }
    (async () => {
      const res = await fetch("/api/admin/auth/me");
      if (!res.ok) {
        router.replace("/admin/login");
        return;
      }
      const json = await res.json();
      setAdmin(json.admin);
      setLoading(false);
    })();
  }, [router, isLogin]);

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  // Login page — render without sidebar shell
  if (isLogin) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500 dark:text-slate-400" />
      </div>
    );
  }

  if (!admin) return null;

  const isActive = (href: string, end?: boolean) =>
    end ? pathname === href : pathname?.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 lg:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/branding/LOGO.png"
            alt="LifeLink"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            LifeLink Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 flex flex-col overflow-y-auto border-r border-slate-200 bg-white pt-3 transition-all duration-200 dark:border-slate-700 dark:bg-slate-800 lg:sticky lg:top-0 lg:h-screen",
            collapsed ? "w-20" : "w-64",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0",
          ].join(" ")}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <Image
              src="/branding/LOGO.png"
              alt="LifeLink"
              width={36}
              height={36}
              className="h-9 w-9 flex-none rounded-xl object-contain"
            />
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  LifeLink Admin
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Dashboard</div>
              </div>
            )}
          </div>

          {/* Collapse toggle + Theme — always visible below logo */}
          <div className={[
            "flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700",
            collapsed ? "justify-center" : "",
          ].join(" ")}>
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden h-8 w-8 flex-none items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 lg:inline-flex"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={[
                  "h-3.5 w-3.5 transition-transform",
                  collapsed ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
            <button
              onClick={toggleTheme}
              className={[
                "inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700",
                collapsed ? "w-8" : "px-3",
              ].join(" ")}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {!collapsed && (
                <span className="text-xs font-semibold">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 p-3">
            {NAV.map((item) => {
              const active = isActive(item.href, item.end);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    collapsed ? "justify-center" : "",
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 flex-none" />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={[
            "border-t border-slate-200 dark:border-slate-700",
            collapsed ? "px-2 py-3" : "mx-3 mb-3 mt-3",
          ].join(" ")}>
            {/* User card */}
            <div className={collapsed ? "" : "rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/50"}>
              <div className={["flex items-center gap-3", collapsed ? "justify-center" : ""].join(" ")}>
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-semibold text-white">
                  {admin.full_name.charAt(0).toUpperCase()}
                </div>
                {!collapsed && (
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {admin.full_name}
                    </div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {admin.email}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/change-password"
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                  collapsed ? "mt-2 w-full px-2 py-2" : "mt-2 w-full px-3 py-2",
                ].join(" ")}
                title={collapsed ? "Change password" : undefined}
              >
                <KeyRound className="h-3.5 w-3.5" />
                {!collapsed && "Change password"}
              </Link>
              <button
                onClick={logout}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                  collapsed ? "mt-2 w-full px-2 py-2" : "mt-2 w-full px-3 py-2",
                ].join(" ")}
                title={collapsed ? "Sign out" : undefined}
              >
                <LogOut className="h-3.5 w-3.5" />
                {!collapsed && "Sign out"}
              </button>
            </div>

            {/* Credit */}
            {!collapsed && (
              <div className="mt-3 overflow-hidden text-center text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                Designed &amp; developed by{" "}
                <a
                  href="https://blackboxtech.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  Black-Box Tech
                </a>
                <div className="mt-1 flex flex-col gap-0.5">
                  <a href="tel:+2348050205349" className="truncate font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">+234 805 020 5349</a>
                  <a href="tel:+2349024787192" className="truncate font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">+234 902 478 7192</a>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {pathname !== "/admin" && (
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Go Back
            </button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
