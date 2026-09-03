import { Container } from "@/components/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand } from "@/lib/brand";
import { getManyContent } from "@/lib/content";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";

export default async function ContactPage() {
  const c = await getManyContent([
    { key: "contact.email", fallback: brand.contact.email },
    { key: "contact.address", fallback: brand.contact.address },
    { key: "contact.phones", fallback: brand.contact.phones.join(", ") },
  ]);

  const email = c["contact.email"];
  const address = c["contact.address"];
  const phones = c["contact.phones"].split(",").map((p) => p.trim()).filter(Boolean);

  const mapsQuery = encodeURIComponent(address);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20 sm:py-28 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Container className="relative">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">Contact Us</div>
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                Let&apos;s talk about membership or partnerships
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Send a message and our team will respond with next steps for membership, partnerships, or your preferred sector.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Main Content */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <MeshGradient variant="ocean" />
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — Contact Info */}
            <div className="space-y-8">
              <ScrollReveal direction="left">
                {/* Address Card */}
                <div className="group rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition hover:shadow-lg hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-indigo-800">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Headquarters</div>
                      <div className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {address}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={100}>
                {/* Email Card */}
                <div className="group rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition hover:shadow-lg hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-indigo-800">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Email</div>
                      <a
                        className="mt-2 inline-flex text-sm leading-7 text-slate-600 dark:text-slate-300 underline underline-offset-4 hover:text-indigo-600"
                        href={`mailto:${email}`}
                      >
                        {email}
                      </a>
                      <div className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Registration</div>
                      <a
                        className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline underline-offset-4"
                        href="/register"
                      >
                        Go to e-registration <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={200}>
                {/* Phone Card */}
                <div className="group rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition hover:shadow-lg hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-indigo-800">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition group-hover:bg-amber-600 group-hover:text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Phone lines</div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right — Contact Form */}
            <ScrollReveal direction="right">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 backdrop-blur-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">Send us a message</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                  Fill out the form below and we&apos;ll get back to you within 24–48 hours.
                </div>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Google Maps */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <ScrollReveal>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="p-6 border-b border-slate-200 dark:border-white/20">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Find us on Google Maps</div>
                </div>
              </div>
              <iframe
                title="LifeLink Group Office Location"
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                width="100%"
                height="400"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block border-0"
              />
              <div className="p-4 border-t border-slate-200 dark:border-white/20 text-center">
                <a
                  href={`https://www.google.com/maps/search/${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline underline-offset-4"
                >
                  Open in Google Maps <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
