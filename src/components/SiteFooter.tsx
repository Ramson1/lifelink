import Link from "next/link";

import { Container } from "@/components/Container";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-black">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <Container className="relative py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/branding/LOGO.png"
                alt={`${brand.shortName} logo`}
                className="h-9 w-9 object-contain"
              />
              <div className="text-sm font-semibold text-white">
                {brand.shortName}
              </div>
            </div>
            <div>
              <div className="text-sm leading-6 text-white/60">
                CAC Registered, Nigeria<br />
              <div className="text-sm font-semibold text-white mb-1 mt-2">Address:</div>
                2 Ordu Avenue, East-West Road, Rumudara,<br />Port Harcourt, Rivers State, Nigeria
              </div>
            </div>
          </div>

          {/* Company links */}
          <div className="grid gap-2 text-sm md:justify-items-start">
            <div className="text-sm font-semibold text-white">Company</div>
            <Link className="text-white/60 transition hover:text-white" href="/services">
              Services
            </Link>
            <Link className="text-white/60 transition hover:text-white" href="/register">
              E-Registration
            </Link>
            <Link className="text-white/60 transition hover:text-white" href="/contact">
              Contact
            </Link>
            <Link className="text-white/60 transition hover:text-white" href="/about/team">
              Team
            </Link>
          </div>

          {/* Explore links */}
          <div className="grid gap-2 text-sm md:justify-items-start">
            <div className="text-sm font-semibold text-white">Explore</div>
            <Link className="text-white/60 transition hover:text-white" href="/partners">
              Partners
            </Link>
            <Link className="text-white/60 transition hover:text-white" href="/events">
              Events
            </Link>
            <a
              className="text-white/60 transition hover:text-white"
              href={`mailto:${brand.contact.email}`}
            >
              {brand.contact.email}
            </a>
          </div>


        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} {brand.shortName}. All rights reserved.
          <span className="mx-2">|</span>
          Designed and developed by{" "}
          <a
            href="https://blackboxtech.online"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white/60 underline underline-offset-4 transition hover:text-white"
          >
            Black-Box Tech
          </a>
          <span className="mx-1">|</span>
          <a
            href="tel:+2348050205349"
            className="font-semibold text-white/60 underline underline-offset-4 transition hover:text-white"
          >
            +234 805 020 5349
          </a>
          <span className="mx-1">/</span>
          <a
            href="tel:+2349024787192"
            className="font-semibold text-white/60 underline underline-offset-4 transition hover:text-white"
          >
            +234 902 478 7192
          </a>
        </div>
      </Container>
    </footer>
  );
}
