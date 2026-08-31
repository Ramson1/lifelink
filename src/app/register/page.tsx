import { Suspense } from "react";

import { Container } from "@/components/Container";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { getManyContent } from "@/lib/content";
import { services } from "@/lib/brand";
import { createServiceClient } from "@/lib/admin/supabase";

export const dynamic = "force-dynamic";

interface DbSector {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  is_active: boolean;
}

async function getDbSectors(): Promise<DbSector[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("lifelink_sectors")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function RegisterPage() {
  const [c, dbSectors] = await Promise.all([
    getManyContent([
      { key: "registration.title", fallback: "Become a LifeLinker in minutes" },
      { key: "registration.subtitle", fallback: "Select your preferred sector, enter your details, and submit. Our team will review and contact you with next steps." },
    ]),
    getDbSectors(),
  ]);

  // Merge: hardcoded services NOT in DB + all DB sectors
  const dbKeys = new Set(dbSectors.map((s) => s.key));
  const allServices = [
    ...services
      .filter((s) => !dbKeys.has(s.key))
      .map((s) => ({ key: s.key, title: s.title, subtitle: s.subtitle, description: s.description })),
    ...dbSectors.map((s) => ({ key: s.key, title: s.title, subtitle: s.subtitle, description: s.description })),
  ];

  return (
    <div className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-18">
      <MeshGradient variant="aurora" />
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_520px] lg:items-start">
          <div className="space-y-6">
            <ScrollReveal>
              <SectionHeading
                eyebrow="E-Registration"
                title={c["registration.title"]}
                description={c["registration.subtitle"]}
              />
            </ScrollReveal>

            <ScrollReveal delay={100}>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6 dark:border-white/20 dark:bg-slate-900/70">
                <div className="text-sm font-semibold text-black dark:text-white">
                  What happens next?
                </div>
                <div className="mt-2 text-sm leading-7 text-black/70 dark:text-white/70">
                  After submission, a representative will reach out to confirm
                  your details and provide onboarding instructions.
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6 dark:border-white/20 dark:bg-slate-900/70">
                <div className="text-sm font-semibold text-black dark:text-white">
                  Need help?
                </div>
                <div className="mt-2 text-sm leading-7 text-black/70 dark:text-white/70">
                  Use the Contact page to ask questions or request a call back.
                </div>
                <a
                  className="mt-4 inline-flex text-sm font-semibold text-black dark:text-white underline underline-offset-4"
                  href="/contact"
                >
                  Contact support
                </a>
              </div>
            </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6 dark:border-white/20 dark:bg-slate-900/70">
                <div className="text-sm font-semibold text-black dark:text-white">Privacy</div>
                <div className="mt-2 text-sm leading-7 text-black/70 dark:text-white/70">
                  Your details are used only for registration and membership
                  onboarding.
                </div>
              </div>
            </ScrollReveal>
          </div>

          <Suspense
            fallback={
              <div className="rounded-3xl border border-black/10 bg-white/70 p-8 text-sm text-black/70 dark:border-white/20 dark:bg-slate-900/70 dark:text-white/70">
                Loading...
              </div>
            }
          >
            <RegistrationWizard services={allServices} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
