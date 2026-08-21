"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

const productLinks = [
  { href: "/routes", key: "routes" },
  { href: "/stations", key: "stations" },
  { href: "/planner", key: "planner" },
  { href: "/tracking", key: "tracking" },
  { href: "/updates", key: "updates" },
] as const;

const exploreLinks = [
  { href: "/analytics", key: "analytics" },
  { href: "/predictions", key: "predictions" },
  { href: "/tickets", key: "tickets" },
  { href: "/fleet", key: "fleet" },
  { href: "/notifications", key: "notifications" },
] as const;

const companyLinks = [
  { href: "mailto:hello@inzira.app", key: "contact" },
] as const;

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type NapItem = {
  href: string;
  external?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  key?: "visit" | "phone" | "mail" | "linkedin" | "instagram";
  label?: string;
  strong?: boolean;
};

const napItems: NapItem[] = [
  {
    href: "https://maps.google.com/?q=Kigali,+Rwanda",
    external: true,
    icon: MapPin,
    key: "visit",
  },
  { href: "tel:+250788000000", icon: Phone, key: "phone", strong: true },
  { href: "mailto:hello@inzira.app", icon: Mail, key: "mail" },
  {
    href: "https://www.linkedin.com/search/results/companies/?keywords=Inzira%20Technologies",
    external: true,
    icon: LinkedInIcon,
    label: "Inzira Technologies",
  },
  {
    href: "https://www.instagram.com/explore/search/keyword/?q=Inzira%20Technologies",
    external: true,
    icon: InstagramIcon,
    label: "Inzira Technologies",
  },
];

function FooterLinks({ links }: { links: ReadonlyArray<{ href: string; key: string }> }) {
  const { t } = useTranslation();
  return (
    <ul className="mt-4 space-y-2.5">
      {links.map((link) => (
        <li key={link.key}>
          <Link
            href={link.href}
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            {t(`footer.${link.key}`)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-px w-5 rounded-full bg-primary/50" />
      <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {children}
      </h4>
    </div>
  );
}

function NapLink({
  href,
  external,
  icon: Icon,
  strong,
  children,
}: {
  href: string;
  external?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  strong?: boolean;
  children: React.ReactNode;
}) {
  const classes = `group inline-flex items-center gap-3 text-sm ${
    strong ? "font-semibold text-foreground hover:text-primary" : "text-muted-foreground hover:text-foreground"
  } transition-colors`;
  const content = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function onSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  }

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      {/* CTA + NAP band */}
      <div className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8">
          <div className="max-w-xl lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              {t("footer.helpTitle")}
            </p>
            <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t("footer.ctaTitle")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              {t("footer.ctaBody")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/planner"
                className="press inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)]"
              >
                {t("nav.planTrip")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/routes"
                className="press inline-flex h-12 items-center gap-2 rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-6 text-sm font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/15"
              >
                {t("footer.browseRoutes")}
              </Link>
            </div>
          </div>

          {/* NAP card */}
          <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-6 backdrop-blur lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/70">
              Inzira Navix Transit
            </p>
            <ul className="mt-5 space-y-3">
              {napItems.map((item) => (
                <li key={item.key ?? item.href}>
                  <NapLink
                    href={item.href}
                    external={item.external}
                    icon={item.icon}
                    strong={item.strong}
                  >
                    <span className="flex flex-col">
                      <span
                        className={`${
                          item.strong
                            ? "text-base font-bold text-primary-foreground"
                            : "text-primary-foreground/90"
                        }`}
                      >
                        {item.label ?? t(`footer.${item.key}`)}
                      </span>
                      {item.strong && (
                        <span className="mt-0.5 text-[11px] uppercase tracking-wider text-primary-foreground/60">
                          {t("footer.helpTitle")}
                        </span>
                      )}
                    </span>
                  </NapLink>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 text-accent">
                  <Clock3 className="h-4 w-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-primary-foreground/60">
                    {t("footer.hoursLabel")}
                  </span>
                  <span className="text-sm font-medium text-primary-foreground/90">
                    {t("footer.hours")}
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-5 overflow-hidden rounded-xl border border-primary-foreground/15 shadow-[var(--shadow-soft)]">
              <iframe
                title="Inzira Technologies on Google Maps"
                src="https://maps.google.com/maps?q=Inzira%20Technologies%20Kigali&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="block h-40 w-full"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) contrast(0.9)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href="https://www.google.com/maps?q=Inzira+Technologies+Kigali"
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              {t("footer.viewLargerMap")}
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
          <div className="mt-6 flex max-w-sm items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-soft)]">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">{t("footer.status")}</span>
          </div>
        </div>

        {/* Product */}
        <div className="lg:col-span-2">
          <ColumnTitle>{t("footer.product")}</ColumnTitle>
          <FooterLinks links={productLinks} />
        </div>

        {/* Explore */}
        <div className="lg:col-span-2">
          <ColumnTitle>{t("footer.explore")}</ColumnTitle>
          <FooterLinks links={exploreLinks} />
        </div>

        {/* Company */}
        <div className="lg:col-span-2">
          <ColumnTitle>{t("footer.company")}</ColumnTitle>
          <FooterLinks links={companyLinks} />
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-2">
          <ColumnTitle>{t("footer.newsletterEyebrow")}</ColumnTitle>
          <p className="mt-3 text-sm font-semibold text-foreground">{t("footer.newsletterTitle")}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t("footer.newsletterBody")}
          </p>
          {subscribed ? (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {t("footer.newsletterSuccess")}
            </div>
          ) : (
            <form onSubmit={onSubscribe} className="mt-4 space-y-2">
              <div className="group relative">
                <span className="pointer-events-none absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-focus-within:bg-primary group-focus-within:text-primary-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.newsletterPlaceholder")}
                  className="h-12 w-full rounded-xl border border-border bg-card py-3 pl-13 pr-4 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <button
                type="submit"
                className="press sheen inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                {t("footer.newsletterButton")}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} Inzira Navix Transit. {t("footer.copyright")}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              {t("footer.terms")}
            </Link>
            <span className="text-[11px] text-muted-foreground/70">{t("footer.photoCredit")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
