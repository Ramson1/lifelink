import Image from "next/image";

import { Container } from "@/components/Container";
import { GradientOrbs } from "@/components/GradientOrbs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand } from "@/lib/brand";
import { listTeamMembers, type TeamMember } from "@/lib/team";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    title: `Our Team — ${brand.shortName}`,
    description:
      "Meet the leadership team driving LifeLink Group's mission to empower individuals and transform communities.",
  };
}

function MemberCard({ member, size = "md" }: { member: TeamMember; size?: "lg" | "md" | "sm" }) {
  const sizeClasses = {
    lg: "max-w-md mx-auto",
    md: "",
    sm: "",
  };
  const imgAspect = {
    lg: "aspect-[3/4]",
    md: "aspect-[4/5]",
    sm: "aspect-[4/5]",
  };
  const nameSize = {
    lg: "text-2xl sm:text-3xl font-extrabold",
    md: "text-base font-bold",
    sm: "text-sm font-bold",
  };
  return (
    <article className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-xl ${sizeClasses[size]}`}>
      <div className={`relative w-full overflow-hidden bg-slate-100 ${imgAspect[size]}`}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className={`${nameSize[size]} leading-tight text-slate-900`}>
          {member.name}
        </div>
        <div className="mt-1 text-sm font-semibold text-indigo-600">
          {member.position}
        </div>
      </div>
    </article>
  );
}

export default function TeamPage() {
  const members = listTeamMembers();
  const ceos = members.filter((m) => m.level === "ceo");
  const directors = members.filter((m) => m.level === "director");
  const managers = members.filter((m) => m.level === "manager");
  const others = members.filter((m) => m.level === "other");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20 sm:py-24">
        <GradientOrbs variant="cool" />
        <Container className="relative">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Leadership</div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                Meet the team behind LifeLink
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                The people driving our mission to turn ordinary people into extraordinary heroes.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* CEO Section */}
      {ceos.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Chief Executive</div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Leadership Vision</h2>
              </div>
            </ScrollReveal>

            {ceos.map((ceo) => (
              <ScrollReveal key={ceo.image} delay={100}>
                <div className="mx-auto max-w-4xl">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid md:grid-cols-2 items-stretch">
                      <div className="relative aspect-[3/4] md:aspect-auto md:min-h-full overflow-hidden bg-slate-100">
                        <Image
                          src={ceo.image}
                          alt={ceo.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center p-8 sm:p-10">
                        <div className="text-2xl sm:text-3xl font-extrabold leading-tight text-slate-900">
                          {ceo.name}
                        </div>
                        <div className="mt-2 text-base font-semibold text-indigo-600">
                          {ceo.position}
                        </div>
                        <div className="mt-6 relative pl-5 border-l-4 border-gradient-r from-amber-400 to-cyan-400" style={{ borderImage: 'linear-gradient(to bottom, #f59e0b, #06b6d4) 1' }}>
                          <p className="text-base leading-8 text-slate-700">
                            For over two decades, LifeLink has remained steadfast in its mission of
                            creating opportunities, promoting economic empowerment, advancing
                            humanitarian services, and building sustainable structures that improve
                            the quality of life for individuals, families, and communities. We
                            believe poverty can be reduced when people are given access to
                            opportunities, knowledge, resources, and a supportive community.
                          </p>
                        </div>
                        <div className="mt-6">
                          <div className="text-sm font-semibold text-slate-900">
                            {brand.founder.name}
                          </div>
                          <div className="mt-1 text-sm italic text-slate-500">
                            &ldquo;{brand.tagline}.&rdquo; We are LifeLinkers.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </Container>
        </section>
      )}

      {/* Directors Section */}
      {directors.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50/50">
          <Container>
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Board of Directors</div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Our Directors</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {directors.map((m, i) => (
                <ScrollReveal key={m.image} delay={i * 100}>
                  <MemberCard member={m} size="md" />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Managers Section */}
      {managers.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Management</div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Our Managers</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {managers.map((m, i) => (
                <ScrollReveal key={m.image} delay={i * 80}>
                  <MemberCard member={m} size="sm" />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Other Team Members */}
      {others.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50/50">
          <Container>
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Our Team</div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Team Members</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {others.map((m, i) => (
                <ScrollReveal key={m.image} delay={i * 80}>
                  <MemberCard member={m} size="sm" />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Empty state */}
      {members.length === 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Team members will be listed here soon.
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
