"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CursorGradient } from "@/components/CursorGradient";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <CursorGradient />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </ThemeProvider>
  );
}
