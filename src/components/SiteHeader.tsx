"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/Container";
import { brand } from "@/lib/brand";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/about/team", label: "Team" },
  { href: "/services", label: "Services" },
  { href: "/register", label: "E-Registration" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeHref = useMemo(() => {
    const exact = links.find((l) => l.href === pathname)?.href;
    if (exact) return exact;
    if (pathname.startsWith("/services")) return "/services";
    if (pathname.startsWith("/register")) return "/register";
    if (pathname.startsWith("/about/team")) return "/about/team";
    if (pathname.startsWith("/about")) return "/about";
    return "";
  }, [pathname]);

  const navLinks = links.filter((l) => l.href !== "/register");

  return (
    <header className="fixed left-0 right-0 top-0 z-50 pt-4">
      <div className="mx-auto w-[75%] rounded-full bg-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/branding/LOGO.png"
              alt={`${brand.shortName} logo`}
              width={40}
              height={40}
              priority
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-black">
                {brand.shortName}
              </div>
              <div className="text-xs text-black/60">{brand.rcNumber}</div>
            </div>
          </Link>

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
                      ? "bg-black/5 text-black"
                      : "text-black/70 hover:bg-black/5 hover:text-black",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="hidden rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 md:inline-block"
            >
              Register
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black transition hover:bg-black/10 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="fixed inset-x-4 top-20 z-40 rounded-3xl bg-white p-6 shadow-2xl md:hidden"
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
                        ? "bg-black/5 text-black"
                        : "text-black/70 hover:bg-black/5 hover:text-black",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
