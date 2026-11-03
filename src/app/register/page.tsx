import { Container } from "@/components/Container";
import { InvestmentForm } from "@/components/registration/InvestmentForm";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { services } from "@/lib/brand";
import { createServiceClient } from "@/lib/admin/supabase";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Join LifeLink",
  description:
    "Register online with LifeLink Group. Choose your sector and join a community-driven movement turning ordinary people into extraordinary heroes.",
  path: "/register",
  keywords: [
    "LifeLink registration",
    "join LifeLink Group",
    "cooperative registration Nigeria",
    "e-registration",
  ],
});

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

/**
 * Validate a ?service= search-param value against the list of sector keys.
 * Anything unknown (or an array from a repeated param) collapses back to the
 * default "investment" sector (our flagship offering) so a bad deep-link never
 * breaks the form.
 */
function resolveService(
  raw: string | string[] | undefined,
  allowedKeys: string[],
): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value && allowedKeys.includes(value)) return value;
  return allowedKeys.includes("investment") ? "investment" : "all";
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const [{ service: serviceParam }, dbSectors] = await Promise.all([
    searchParams,
    getDbSectors(),
  ]);

  // "General" catch-all option for users without a specific sector.
  const generalOption = {
    key: "all",
    title: "I'm not sure — help me choose",
    subtitle: "Pick this if you would like our team to guide you to the right sector.",
    description: "You can always change your sector later by contacting our team.",
  };

  // DB-first: if DB has sectors, use only DB. Otherwise fall back to hardcoded.
  const sectorOptions =
    dbSectors.length > 0
      ? dbSectors.map((s) => ({
          key: s.key,
          title: s.title,
          subtitle: s.subtitle,
          description: s.description,
        }))
      : services.map((s) => ({
          key: s.key,
          title: s.title,
          subtitle: s.subtitle,
          description: s.description,
        }));

  // Flagship "LifeLink Investment and Savings" first, then the general
  // catch-all, then the remaining sectors.
  const ordered = [...sectorOptions].sort(
    (a, b) => (b.key === "investment" ? 1 : 0) - (a.key === "investment" ? 1 : 0),
  );
  const allServices = [generalOption, ...ordered];
  const defaultService = resolveService(
    serviceParam,
    allServices.map((s) => s.key),
  );

  return (
    <div className="relative bg-white pt-24 pb-16 sm:pt-28 sm:pb-20 dark:bg-slate-950">
      <Container>
        <div className="mx-auto max-w-2xl">
          {defaultService === "investment" ? (
            <InvestmentForm
              services={allServices}
              defaultService={defaultService}
            />
          ) : (
            <RegistrationForm
              services={allServices}
              defaultService={defaultService}
            />
          )}
        </div>
      </Container>
    </div>
  );
}
