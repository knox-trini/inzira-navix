"use client";

import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useAuth, type AuthUser } from "@/hooks/useAuth";

function ContactForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="hairline-top flex flex-col items-center gap-4 rounded-2xl border border-success/30 bg-success/10 p-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="font-display text-2xl font-bold">{t("contact.successTitle")}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{t("contact.successBody")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="hairline-top rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold">{t("contact.formTitle")}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{t("contact.formBody")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("contact.name")}
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-ring/40"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("contact.email")}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-ring/40"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("contact.subject")}
        </span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-ring/40"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("contact.message")}
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-ring/40"
        />
      </label>

      <button
        type="submit"
        className="press sheen mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
      >
        <Send className="h-4 w-4" />
        {t("contact.submit")}
      </button>
    </form>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-background text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="block truncate font-semibold">{value}</span>
      </span>
    </>
  );
  const cls =
    "hairline-top flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-panel)]";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {content}
    </a>
  ) : (
    <a href={href} className={cls}>
      {content}
    </a>
  );
}

export function ContactPage({ user }: { user?: AuthUser | null }) {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const current = user ?? authUser;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("contact.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight sm:text-6xl">{t("contact.title")}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t("contact.body")}</p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <ContactCard
            icon={Mail}
            label={t("contact.emailLabel")}
            value={t("footer.mail")}
            href={`mailto:${t("footer.mail")}`}
          />
          <ContactCard
            icon={Phone}
            label={t("contact.phoneLabel")}
            value={t("footer.phone")}
            href={`tel:${t("footer.phone").replace(/\s/g, "")}`}
          />
          <ContactCard
            icon={MapPin}
            label={t("contact.visitLabel")}
            value={t("footer.visit")}
            href="https://maps.google.com/?q=Kigali,+Rwanda"
            external
          />

          {current && (
            <div className="hairline-top rounded-2xl border border-primary/25 bg-primary-soft/30 p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("contact.signedInAs")}
              </div>
              <div className="mt-1 font-semibold">{current.name}</div>
              <div className="text-sm text-muted-foreground">{current.email}</div>
            </div>
)}
        </div>
      </div>
    </div>
  );
}
