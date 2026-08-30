import Image from "next/image";
import Link from "next/link";
import * as lucideIcons from "lucide-react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { Container } from "@/components/Container";
import { FaqAccordion, type FaqAnswerBlock } from "@/components/FaqAccordion";
import { GradientOrbs } from "@/components/GradientOrbs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand, services } from "@/lib/brand";
import { defaultFaqs } from "@/lib/default-faqs";
import { getManyContent } from "@/lib/content";
import { createServiceClient } from "@/lib/admin/supabase";

function getIcon(name: string) {
  const Icon = (lucideIcons as any)[name];
  return Icon ?? null;
}

const partners = [
  { src: "/trust/beautcia.png", alt: "Beautcia" },
  { src: "/trust/lifelink.png", alt: "LifeLink" },
  { src: "/trust/lnex.png", alt: "Lnex" },
  { src: "/trust/metashares.png", alt: "Metashares" },
  { src: "/trust/naasify.png", alt: "Naasify" },
  { src: "/trust/rhema.png", alt: "Rhema" },
];

export default async function Home() {
  const c = await getManyContent([
    { key: "hero.tagline", fallback: "Build Your Future With" },
    { key: "hero.subtagline", fallback: brand.intro },
    { key: "hero.badge", fallback: `Registration Open for ${new Date().getFullYear()}` },
    { key: "about.intro", fallback: brand.intro },
    { key: "about.mission", fallback: brand.mission },
    { key: "about.vision", fallback: brand.vision },
  ]);

  // Fetch published FAQs from DB, fall back to defaults
  let faqs: { id: string; question: string; answerBlocks: FaqAnswerBlock[] }[] = [];
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("lifelink_faqs")
      .select("id, question, answer, category")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (data && data.length > 0) {
      faqs = data.map((f) => ({
        id: f.id,
        question: f.question,
        answerBlocks: [{ type: "text", content: f.answer }] as FaqAnswerBlock[],
      }));
    }
  } catch {
    // FAQs are non-critical
  }
  // Use default FAQs if no DB FAQs exist
  if (faqs.length === 0) {
    faqs = defaultFaqs;
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden selection:bg-cyan-500/20">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/branding/motionimg.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 backdrop-blur-[1px]" />

        <div className="relative z-10 w-full pt-24 pb-12 sm:pt-28">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <div className="glass-panel inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6 text-sm font-medium text-white shadow-sm border border-white/60 animate-float">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                  {c["hero.badge"]}
                </div>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <span className="block mb-2">{c["hero.tagline"]}</span>
                <span className="block drop-shadow-sm p-2" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316, #eab308, #fb923c)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shine 3s linear infinite' }}>{brand.shortName}</span>
              </h1>
              
              {/* Description */}
              <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-white animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                {c["hero.subtagline"]} With over 21 years of excellence across humanitarian services, finance, trade, agriculture, and digital innovation.
              </p>
              
              {/* Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                <Link
                  href="/register"
                  className="btn-shine w-full sm:w-auto rounded-full px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
                >
                  Start Registration
                </Link>
                <Link
                  href="/services"
                  className="glass-card w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-slate-700 hover:text-indigo-600 transition-all duration-300 group"
                >
                  Explore Services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Container>
        </div>

        {/* Partners Section — temporarily hidden
        <div className="relative z-10 w-full py-8 border-t border-slate-200/50">
          <Container>
            <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
              Trusted by our partners
            </p>
          </Container>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex animate-scroll-left">
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={`${partner.alt}-${i}`}
                  className="flex-none mx-10 flex items-center justify-center"
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={120}
                    height={48}
                    className="h-10 w-auto object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        */}
      </section>

      {/* About Intro Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <GradientOrbs variant="warm" />
        <Container>
          <ScrollReveal>
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">About</div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                  {brand.name}
                </h2>
                <p className="text-lg leading-8 text-slate-600">
                  {c["about.intro"]}
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/branding/LOGO.png"
                    alt="LifeLink logo"
                    width={56}
                    height={56}
                  />
                  <div>
                    <div className="text-sm font-semibold text-black">
                      {brand.shortName}
                    </div>
                    <div className="text-sm text-black/70">{brand.tagline}</div>
                  </div>
                </div>
                <div className="mt-6 text-sm leading-7 text-black/70">
                  {brand.about}
                </div>
                <div className="mt-6 grid gap-2">
                  <div className="text-sm font-semibold text-black">Core values</div>
                  <div className="flex flex-wrap gap-2">
                    {brand.values.map((v) => (
                      <div
                        key={v}
                        className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70"
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section className="relative py-12 sm:py-16">
        <Container>
          <ScrollReveal delay={100}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative rounded-3xl border border-black/10 bg-white/70 p-8 backdrop-blur-sm overflow-hidden">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />
                <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-gradient-to-br from-cyan-400 to-amber-400" />
                <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Mission
                </div>
                <div className="mt-3 text-base leading-7 text-black/80">
                  {c["about.mission"]}
                </div>
              </div>
              <div className="relative rounded-3xl border border-black/10 bg-white/70 p-8 backdrop-blur-sm overflow-hidden">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
                <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-gradient-to-br from-cyan-400 to-amber-400" />
                <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Vision
                </div>
                <div className="mt-3 text-base leading-7 text-black/80">
                  {c["about.vision"]}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Why Choose LifeLink */}
      <section className="relative py-24 sm:py-32">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Why choose LifeLink</div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                Built on trust, structure, and impact
              </h2>
              <p className="text-lg text-slate-600">
                Over two decades of measurable results across communities, families, and businesses.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brand.whyChoose.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm transition hover:bg-white hover:shadow-lg">
                  <div className="text-sm font-semibold text-black">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-black/70">
                    {item.description}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Services / Sectors Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white/0 backdrop-blur-sm -z-10"></div>
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                <span className="text-gradient">Our Sectors</span>
              </h2>
              <p className="text-lg text-slate-600">
                One platform, diverse opportunities — from humanitarian services and finance to agriculture, energy, and digital assets.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon);
              const [from, to] = service.color;
              return (
                <ScrollReveal key={service.key} delay={index * 80}>
                <Link
                  key={service.key}
                  href={`/sectors/${service.key}`}
                  className="glass-card flex flex-col overflow-hidden rounded-[2rem] p-8 animate-fade-in-up group block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between gap-x-4 mb-6">
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                        boxShadow: `0 10px 25px -10px ${from}aa`,
                      }}
                    >
                      {Icon && <Icon className="h-7 w-7" strokeWidth={1.8} />}
                    </div>
                    {index === 0 && (
                       <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/50 backdrop-blur-sm">
                         <Sparkles className="w-3 h-3" /> Featured
                       </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold leading-8 text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="mt-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {service.subtitle}
                  </p>
                  
                  <p className="mt-4 text-base leading-relaxed text-slate-600 flex-grow">
                    {service.description}
                  </p>
                  
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 border-t border-slate-200/60 pt-6">
                    {service.highlights.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex gap-x-3 items-start">
                        <CheckCircle2 className="h-5 w-5 flex-none text-cyan-500 mt-0.5" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:gap-2 transition-all">
                    Explore sector <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                </ScrollReveal>
              );
            })}
          </div>
          
          <div className="mt-20 text-center animate-fade-in-up">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-base font-semibold text-indigo-600 hover:text-indigo-500 hover:underline underline-offset-4 transition-all"
            >
              View all service details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 sm:py-32">
          <Container>
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                  Frequently Asked <span className="text-gradient">Questions</span>
                </h2>
                <p className="text-lg text-slate-600">
                  Find answers to common questions about LifeLink Group, registration, and our services.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <FaqAccordion items={faqs} />
            </ScrollReveal>
          </Container>
        </section>

      {/* CTA Section */}
      <section className="relative isolate px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 opacity-90"></div>
          {/* Animated gradient orbs for CTA background */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="mx-auto max-w-2xl text-center relative z-10 animate-fade-in-up">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-8">
            Ready to become a LifeLinker?
          </h2>
          <p className="mx-auto max-w-xl text-xl leading-8 text-slate-300 mb-12">
            Join a community-driven movement built on honesty, transparency, and quality service. Registration is simple, secure, and your first step toward lasting impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-full bg-white px-10 py-4 text-base font-bold text-slate-900 shadow-xl shadow-white/10 hover:bg-slate-100 hover:scale-105 transition-all duration-300"
            >
              Get started now
            </Link>
            <Link href="/contact" className="text-base font-semibold leading-6 text-white hover:text-cyan-400 transition-colors flex items-center gap-2">
              Contact support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
