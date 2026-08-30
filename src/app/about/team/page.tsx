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
                <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">A Message from the CEO</div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Leadership Vision</h2>
              </div>
            </ScrollReveal>

            {ceos.map((ceo) => (
              <ScrollReveal key={ceo.image} delay={100}>
                <div className="mx-auto max-w-4xl">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {/* Photo + Name Header */}
                    <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 p-8 sm:p-10 text-white">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative h-40 w-40 flex-none overflow-hidden rounded-full border-4 border-white/30 bg-white/10">
                          <Image
                            src={ceo.image}
                            alt={ceo.name}
                            fill
                            sizes="160px"
                            className="object-cover"
                          />
                        </div>
                        <div className="text-center sm:text-left">
                          <div className="text-2xl sm:text-3xl font-extrabold leading-tight">
                            {ceo.name}
                          </div>
                          <div className="mt-1 text-base font-semibold text-white/80">
                            {ceo.position}
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            {brand.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Message */}
                    <div className="p-8 sm:p-10 space-y-6">
                      <div className="text-lg font-bold text-slate-900">
                        Welcome to LIFELINK GROUP INTERNATIONAL LIMITED
                      </div>
                      <div className="text-sm font-semibold text-indigo-600">Dear Friends, Partners, Members, and Visitors,</div>

                      <p className="text-base leading-8 text-slate-700">
                        It gives me great pleasure to welcome you to LIFELINK GROUP INTERNATIONAL LIMITED, a dynamic and community-driven organization committed to transforming ordinary people into extraordinary heroes.
                      </p>
                      <p className="text-base leading-8 text-slate-700">
                        For over two decades, LIFELINK has remained steadfast in its mission of creating opportunities, promoting economic empowerment, advancing humanitarian services, and building sustainable structures that improve the quality of life for individuals, families, and communities.
                      </p>
                      <p className="text-base leading-8 text-slate-700">
                        What began as a Cooperative Society has evolved into a diversified organization with interests in Humanitarian Services, Cooperative Development, Finance, Agriculture, Trade and Investments, Transportation, Land Banking, Information Technology, Digital Assets, Food Security, Affiliate Marketing, Production, and Community Development Projects.
                      </p>
                      <p className="text-base leading-8 text-slate-700">
                        At LIFELINK, we believe that poverty can be reduced when people are given access to opportunities, knowledge, resources, and a supportive community. Our commitment is to build a platform where individuals can grow, earn, invest, learn, and contribute meaningfully to society.
                      </p>

                      <div>
                        <p className="text-base leading-8 text-slate-700">Through our <strong>Project 2030 Vision</strong>, we are pursuing ambitious goals that include:</p>
                        <ul className="mt-4 space-y-3">
                          {[
                            "Expanding our humanitarian and grassroots initiatives across Nigeria and beyond.",
                            "Building a membership base of over 20,000 verified members.",
                            "Advancing digital transformation through innovative technology solutions.",
                            "Promoting food security and subsidization programs for millions of people.",
                            "Supporting entrepreneurs through grants, loans, and business development initiatives.",
                            "Providing training in skill acquisition, agriculture, digital assets, and emerging opportunities.",
                            "Facilitating access to land ownership, transportation solutions, and community infrastructure projects.",
                          ].map((goal) => (
                            <li key={goal} className="flex items-start gap-3 text-base leading-8 text-slate-700">
                              <span className="mt-3 h-2 w-2 flex-none rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-base leading-8 text-slate-700">
                        Our success over the years has been built on three fundamental principles: <strong>Honesty</strong>, <strong>Transparency</strong>, and <strong>Quality Service</strong>. These values continue to guide every decision we make and every relationship we build.
                      </p>
                      <p className="text-base leading-8 text-slate-700">
                        As we look toward the future, we invite individuals, organizations, investors, development partners, and community leaders to join us in creating lasting impact. Together, we can build one of Africa&apos;s largest and most effective community-based organizations while improving lives and creating opportunities for generations to come.
                      </p>
                      <p className="text-base leading-8 text-slate-700">
                        Thank you for visiting our website and for taking the time to learn more about our vision. We look forward to partnering with you on this remarkable journey.
                      </p>

                      {/* Signature */}
                      <div className="mt-8 border-t border-slate-200 pt-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Warm regards,</div>
                        <div className="mt-2 text-lg font-bold text-slate-900">
                          PASTOR OBI NWAGBO
                        </div>
                        <div className="text-sm font-semibold text-indigo-600">
                          {brand.founder.role}
                        </div>
                        <div className="text-sm text-slate-500">
                          {brand.name}
                        </div>
                        <div className="mt-2 text-sm italic text-slate-500">
                          &ldquo;{brand.tagline}.&rdquo; WE ARE LIFELINKERS.
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
