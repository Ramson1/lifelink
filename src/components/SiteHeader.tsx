"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";

import { brand } from "@/lib/brand";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "/services", label: "Services" },
  { href: "/register", label: "E-Registration" },
  { href: "/contact", label: "Contact" },
];

const exploreLinks = [
  { href: "/about/team", label: "Team" },
  { href: "/partners", label: "Partners" },
  { href: "/events", label: "Events" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const activeHref = useMemo(() => {
    const allLinks = [...links, ...exploreLinks];
    const exact = allLinks.find((l) => l.href === pathname)?.href;
    if (exact) return exact;
    if (pathname.startsWith("/services")) return "/services";
    if (pathname.startsWith("/register")) return "/register";
    if (pathname.startsWith("/contact")) return "/contact";
    if (pathname.startsWith("/about/team")) return "/about/team";
    if (pathname.startsWith("/partners")) return "/partners";
    if (pathname.startsWith("/events")) return "/events";
    if (pathname.startsWith("/advertising")) return "/advertising";
    if (pathname.startsWith("/fundraise")) return "/fundraise";
    return "";
  }, [pathname]);

  const isExploreActive = exploreLinks.some((l) => pathname?.startsWith(l.href));

  const navLinks = links.filter((l) => l.href !== "/register");

  return (
    <header className="fixed left-0 right-0 top-0 z-50 pt-4">
      <div className="mx-auto w-[75%] rounded-full bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-950/50">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Company logo = home button */}
          <Link href="/" className="flex items-center gap-3 transition opacity-90 hover:opacity-100">
            <Image
              src="/branding/LOGO.png"
              alt={`${brand.shortName} logo`}
              width={52}
              height={52}
              priority
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-black dark:text-white">
                {brand.shortName}
              </div>
              <div className="text-xs text-black/60 dark:text-white/60">{brand.rcNumber}</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const active = activeHref === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                      : "text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Explore dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                className={[
                  "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition",
                  isExploreActive || exploreOpen
                    ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                    : "text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                ].join(" ")}
              >
                Explore
                <ChevronDown
                  className={[
                    "h-3.5 w-3.5 transition-transform",
                    exploreOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>
              {exploreOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                  <div className="w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                    {exploreLinks.map((link) => {
                      const active = activeHref === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={[
                            "block px-4 py-2.5 text-sm font-semibold transition",
                            active
                              ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                              : "text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                          ].join(" ")}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20 dark:hover:text-white"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <Link
              href="/register"
              className="hidden rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 md:inline-block"
            >
              Register
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black transition hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open ? (
          <div
            id="mobile-nav"
            className="fixed inset-x-4 top-20 z-40 rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 md:hidden"
          >
            <div className="grid gap-1">
              {links.map((link) => {
                const active = activeHref === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "rounded-2xl px-4 py-3 text-base font-semibold transition",
                      active
                        ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                        : "text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Explore section (accordion) */}
              <div className="mt-1 border-t border-black/10 pt-2 dark:border-white/10">
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                  Explore
                </div>
                {exploreLinks.map((link) => {
                  const active = activeHref === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={[
                        "rounded-2xl px-4 py-3 text-base font-semibold transition",
                        active
                          ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                          : "text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Register link on mobile */}
              <div className="mt-1 border-t border-black/10 pt-2 dark:border-white/10">
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-black px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                >
                  E-Registration
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
