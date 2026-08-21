"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  MapPin,
  Clock,
  Bell,
  Route as RouteIcon,
  Navigation,
  Sparkles,
  AlertTriangle,
  TrafficCone,
  Building2,
  Users,
  CheckCircle2,
  BusFront,
  Radio,
  TrendingUp,
  Wifi,
  Leaf,
  QrCode,
  BrainCircuit,
  MessageCircle,
  UserCircle,
  HelpCircle,
  Smartphone,
  Monitor,
  Phone,
} from "lucide-react";
import { AnimatedBus } from "@/components/AnimatedBus";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { ControlCenter } from "@/components/ControlCenter";

const featureIcons = [RouteIcon, MapPin, Clock, Bell, Navigation, Sparkles];
const featureLinks = ["/routes", "/stations", "/stations", "/updates", "/planner", "/tracking"] as const;
const problemIcons = [Clock, RouteIcon, TrafficCone, AlertTriangle];
const techIcons = [Radio, Clock, QrCode, Wifi, RouteIcon, Leaf];
const operators = ["Royal Express", "Kigali Bus Services", "Volcano Express", "Omega Car", "Capital Bus", "Stella Express"];

function Eyebrow({ children, tone = "accent" }: { children: React.ReactNode; tone?: "accent" | "primary" }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-px w-8 ${tone === "accent" ? "bg-accent" : "bg-primary"}`} />
      <span
        className={`text-[11px] font-bold uppercase tracking-[0.22em] ${
          tone === "accent" ? "text-accent" : "text-primary"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const problems = t("home.problems", { returnObjects: true }) as { t: string; d: string }[];
  const features = t("home.features", { returnObjects: true }) as { t: string; d: string }[];
  const commuterBenefits = t("home.commuterBenefits", { returnObjects: true }) as string[];
  const cityBenefits = t("home.cityBenefits", { returnObjects: true }) as string[];
  const phases = t("home.phases", { returnObjects: true }) as { p: string; t: string; items: string[] }[];
  const techLoop = t("home.techLoop", { returnObjects: true }) as { t: string; d: string }[];
  const slideCaptions = t("home.heroSlideCaptions", { returnObjects: true }) as string[];

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-[#04140d]">
        <HeroSlideshow captions={slideCaptions} />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-2xl text-white">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300">
                  {t("home.pilotBadge")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="font-display text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.25rem]"
              >
                {t("home.heroLine1")} <br />
                {t("home.heroLine2For")}{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-200 bg-clip-text text-transparent">
                  {t("home.heroLine2Highlight")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-7 max-w-xl text-lg leading-relaxed text-white/75"
              >
                {t("home.heroSubtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/planner"
                  className="press sheen group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-amber-400/25"
                >
                  {t("home.planTrip")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/tracking"
                  className="press inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
                >
                  {t("home.seeLive")}
                </Link>
              </motion.div>

              <motion.dl
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="mt-16 grid max-w-lg grid-cols-3 gap-10 border-t border-white/15 pt-10"
              >
                {[
                  { k: "6+", v: t("home.statRoutes") },
                  { k: "10+", v: t("home.statStations") },
                  { k: "<1min", v: t("home.statTime") },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-4xl font-extrabold tracking-tight text-amber-400">{s.k}</dt>
                    <dd className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </div>

            {/* Product mock */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="hidden lg:block"
            >
              <div className="relative mx-auto w-full max-w-md">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-emerald-400/20 blur-3xl" />
                <div className="glass overflow-hidden rounded-3xl border border-white/15 text-white shadow-[var(--shadow-lift)]">
                  <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                        <Radio className="h-4 w-4 text-amber-300" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold">Live tracking</div>
                        <div className="text-[11px] text-white/50">6 vehicles online</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Live
                    </span>
                  </div>

                  <div className="space-y-3 px-6 py-5">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
                          <BusFront className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="text-sm font-semibold">Route 24 · Downtown</div>
                          <div className="text-[11px] text-white/50">Kigali Bus Services</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg font-bold text-amber-300">3 min</div>
                        <div className="text-[10px] uppercase tracking-wider text-white/40">ETA</div>
                      </div>
                    </div>

                    <div className="px-1">
                      <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/50">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-amber-300" /> Nyarugenge
                        </span>
                        <span className="flex items-center gap-1.5">
                          Next stop <span className="font-semibold text-white/80">Kimironko</span>
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-300 to-amber-300" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
                          <TrendingUp className="h-3 w-3" /> On-time rate
                        </div>
                        <div className="mt-1 font-display text-xl font-bold text-emerald-200">96%</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45">
                          <Clock className="h-3 w-3" /> Avg wait
                        </div>
                        <div className="mt-1 font-display text-xl font-bold text-amber-200">5.2m</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTROL CENTER — live command dashboard */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow tone="accent">{t("home.controlCenterEyebrow")}</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t("home.controlCenterTitle")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t("home.controlCenterBody")}</p>
          </div>
          <Link
            href="/routes"
            className="press group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-[var(--shadow-soft)] transition-colors hover:border-primary/30"
          >
            {t("routesPage.title")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10">
          <ControlCenter />
        </div>
      </section>

      {/* TECH LOOP — animated bus marquee */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[#04140d] py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow tone="accent">{t("home.techLoopEyebrow")}</Eyebrow>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t("home.techLoopTitle")}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/65">{t("home.techLoopBody")}</p>
            </div>
            <Link
              href="/tracking"
              className="press group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              {t("home.techLoopCta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="relative mt-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#04140d] to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#04140d] to-transparent sm:w-24" />
          <div className="marquee flex w-max hover:[animation-play-state:paused]">
            {[0, 1].map((dup) => (
              <div key={dup} aria-hidden={dup === 1 || undefined} className="flex items-stretch gap-5 pr-5">
                {techLoop.map((item, i) => {
                  const Icon = techIcons[i];
                  return (
                    <div
                      key={item.t}
                      className="flex w-[24rem] items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur"
                    >
                      <AnimatedBus className="h-16 w-36 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-amber-300">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate text-sm font-bold text-white">{item.t}</span>
                        </div>
                        <div className="mt-1.5 text-xs leading-snug text-white/55">{item.d}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10 border-t border-white/10">
          <div className="marquee-reverse flex w-max items-center py-4 hover:[animation-play-state:paused]">
            {[0, 1].map((dup) => (
              <div key={dup} aria-hidden={dup === 1 || undefined} className="flex items-center gap-10 pr-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300/80">
                  {t("home.operatorsTracked")}
                </span>
                {operators.map((n) => (
                  <span key={n} className="text-sm font-semibold text-white/55">
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Eyebrow>{t("home.problemEyebrow")}</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              {t("home.problemTitle1")} <br />
              {t("home.problemTitle2")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t("home.problemBody")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {problems.map((p, i) => {
              const Icon = problemIcons[i];
              return (
                <div
                  key={p.t}
                  className="hairline-top group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-panel)]"
                >
                  <div className="mb-6 inline-grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border/70 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Eyebrow tone="primary">{t("home.featuresEyebrow")}</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t("home.featuresTitle")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {t("home.featuresBody")}
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={f.t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Link
                    href={featureLinks[i]}
                    className="hairline-top group relative block h-full overflow-hidden rounded-2xl border border-border/80 bg-card p-8 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-panel)]"
                  >
                    <div className="mb-7 inline-grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold">{f.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
                    <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {t("home.explore")} <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>{t("home.benefitsEyebrow")}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            {t("home.benefitsTitle1")} <br />
            {t("home.benefitsTitle2")}
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="hairline-top relative overflow-hidden rounded-3xl border border-primary/20 bg-primary-soft/40 p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="mb-8 inline-grid h-12 w-12 place-items-center rounded-xl bg-background text-primary shadow-[var(--shadow-soft)]">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold">{t("home.forCommuters")}</h3>
            <ul className="mt-6 space-y-3.5 text-sm font-medium">
              {commuterBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hairline-top relative overflow-hidden rounded-3xl border border-accent/25 bg-accent/5 p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="mb-8 inline-grid h-12 w-12 place-items-center rounded-xl bg-background text-accent-foreground shadow-[var(--shadow-soft)]">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold">{t("home.forCities")}</h3>
            <ul className="mt-6 space-y-3.5 text-sm font-medium">
              {cityBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="border-y border-border/70 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow tone="primary">{t("home.roadmapEyebrow")}</Eyebrow>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t("home.roadmapTitle")}
              </h2>
            </div>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {phases.map((ph, i) => (
              <div
                key={ph.p}
                className="hairline-top relative overflow-hidden rounded-2xl border border-border/80 bg-card p-8 shadow-[var(--shadow-soft)]"
              >
                <span className="pointer-events-none absolute -right-3 -top-10 select-none font-display text-[140px] font-extrabold leading-none text-primary/[0.07]">
                  0{i + 1}
                </span>
                <div className="relative">
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {ph.p}
                  </span>
                  <h3 className="mt-2 text-xl font-bold">{ph.t}</h3>
                  <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                    {ph.items.map((it) => (
                      <li key={it} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#04140d] px-8 py-20 text-white sm:px-16">
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-emerald-700/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t("home.ctaTitle1")} <br />
              {t("home.ctaTitle2")}
            </h2>
            <p className="mt-5 text-lg text-white/70">
              {t("home.ctaBody")}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="press sheen rounded-xl bg-amber-400 px-8 py-4 text-sm font-bold text-emerald-950 shadow-lg shadow-amber-400/25"
              >
                {t("home.ctaPrimary")}
              </Link>
              <Link
                href="/routes"
                className="press rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur hover:bg-white/10"
              >
                {t("home.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8" id="how-it-works">
        <div className="max-w-3xl">
          <Eyebrow>{t("landing.howItWorks.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {t("landing.howItWorks.body")}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(t("landing.howItWorks.steps", { returnObjects: true }) as { n: string; t: string; d: string }[]).map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="hairline-top relative overflow-hidden rounded-2xl border border-border/80 bg-card p-8 shadow-[var(--shadow-soft)]"
            >
              <span className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[120px] font-extrabold leading-none text-primary/[0.07]">
                {step.n}
              </span>
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                  {step.n}
                </span>
                <h3 className="mt-5 text-xl font-bold">{step.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI ASSISTANT */}
      <section className="border-y border-border/70 bg-surface" id="ai-assistant">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <Eyebrow tone="accent">{t("landing.aiAssistant.eyebrow")}</Eyebrow>
              <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
                {t("landing.aiAssistant.title")}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {t("landing.aiAssistant.body")}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {(t("landing.aiAssistant.features", { returnObjects: true }) as { t: string; d: string }[]).map((f, i) => (
                  <motion.div
                    key={f.t}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
                  >
                    <h4 className="text-sm font-bold">{f.t}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.d}</p>
                  </motion.div>
                ))}
              </div>
              <Link
                href="/auth"
                className="press group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                <BrainCircuit className="h-4 w-4" />
                {t("landing.aiAssistant.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* AI Conversation Demo */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md">
                <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[var(--shadow-panel)]">
                  <div className="flex items-center gap-3 border-b border-border/60 bg-primary/5 px-5 py-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                      <BrainCircuit className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Inzira AI Assistant</p>
                      <p className="text-[11px] text-muted-foreground">Always ready to help</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1.5 rounded-lg bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
                    </span>
                  </div>
                  <div className="space-y-4 px-5 py-6">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground">
                        {t("landing.aiAssistant.userMessage1")}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm">
                        {t("landing.aiAssistant.aiMessage1")}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground">
                        {t("landing.aiAssistant.userMessage2")}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm">
                        {t("landing.aiAssistant.aiMessage2")}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border/60 px-5 py-3">
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground/60">Ask anything...</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ACCESSIBILITY / LOW-TECH */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8" id="accessibility">
        <div className="max-w-3xl">
          <Eyebrow tone="accent">{t("landing.accessibility.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("landing.accessibility.title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {t("landing.accessibility.body")}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {(() => {
            const channels = t("landing.accessibility.channels", { returnObjects: true }) as { t: string; d: string }[];
            const channelIcons = [Smartphone, Monitor, Phone];
            return channels.map((ch, i) => {
              const Icon = channelIcons[i];
              return (
                <motion.div
                  key={ch.t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="hairline-top group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-8 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-panel)]"
                >
                  <div className="mb-6 inline-grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{ch.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ch.d}</p>
                </motion.div>
              );
            });
          })()}
        </div>

        <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("landing.accessibility.ussdNote")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
