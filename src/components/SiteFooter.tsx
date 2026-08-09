import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-white/60">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/branding/LOGO.png"
                alt={`${brand.shortName} logo`}
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <div className="text-sm font-semibold text-black">
                {brand.shortName}
              </div>
            </div>
            <div className="text-sm text-black/70">{brand.tagline}</div>
            <div className="text-sm text-black/60">
              {brand.office.city}, {brand.office.state}, {brand.office.country}
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="text-sm font-semibold text-black">Company</div>
            <Link className="text-black/70 hover:text-black" href="/about">
              About
            </Link>
            <Link className="text-black/70 hover:text-black" href="/services">
              Services
            </Link>
            <Link className="text-black/70 hover:text-black" href="/register">
              E-Registration
            </Link>
            <Link className="text-black/70 hover:text-black" href="/contact">
              Contact
            </Link>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-black">Compliance</div>
            <div className="text-sm text-black/70">
              {brand.rcNumber}
            </div>
            <div className="text-sm text-black/60">
              © {new Date().getFullYear()} {brand.shortName}. All rights reserved.
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-6 text-center text-xs text-black/50">
          Designed and developed by{" "}
          <a
            href="https://blackboxtech.online"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black/70 underline underline-offset-4 hover:text-black"
          >
            Black-Box Tech
          </a>
          {" | "}
          <a
            href="tel:+2348050205349"
            className="font-semibold text-black/70 underline underline-offset-4 hover:text-black"
          >
            +234 805 020 5349
          </a>
          {" / "}
          <a
            href="tel:+2349024787192"
            className="font-semibold text-black/70 underline underline-offset-4 hover:text-black"
          >
            +234 902 478 7192
          </a>
        </div>
      </Container>
    </footer>
  );
}
