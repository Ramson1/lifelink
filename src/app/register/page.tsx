import { Suspense } from "react";

import { Container } from "@/components/Container";
import { MeshGradient } from "@/components/MeshGradient";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
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
  const dbSectors = await getDbSectors();

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
        <div className="mx-auto max-w-xl">
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
