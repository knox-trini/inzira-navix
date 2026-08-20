"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, type AuthProviderName, type AuthUser } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { notificationFeed } from "@/data/kigali";
import {
  Mail,
  User as UserIcon,
  Lock,
  LogOut,
  Bell,
  BrainCircuit,
  BarChart3,
  BusFront,
  Ticket,
  Navigation,
} from "lucide-react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" {...props}><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);

const SlackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 8.836a2.528 2.528 0 0 1-2.521-2.52V3.793A2.528 2.528 0 0 1 8.834 1.27a2.528 2.528 0 0 1 2.521 2.52v2.523h-2.521zM8.834 10.107a2.527 2.527 0 0 1 2.521-2.52h6.313a2.527 2.527 0 0 1 2.521 2.52 2.527 2.527 0 0 1-2.521 2.521H11.355a2.527 2.527 0 0 1-2.521-2.521zm10.122-1.271a2.528 2.528 0 0 1 2.522-2.523 2.528 2.528 0 0 1 2.52 2.523v2.52h-2.52v-2.52zm-1.271 6.33a2.527 2.527 0 0 1-2.522 2.52 2.527 2.527 0 0 1-2.52-2.52v-6.313a2.527 2.527 0 0 1 2.52-2.52h.001a2.527 2.527 0 0 1 2.521 2.52v6.313zm-3.804 3.804a2.528 2.528 0 0 1 2.521 2.52v2.52a2.528 2.528 0 0 1-2.521 2.522 2.528 2.528 0 0 1-2.521-2.522V21.49a2.528 2.528 0 0 1 2.521-2.52zm-6.313-1.271a2.527 2.527 0 0 1-2.52 2.52H1.272a2.528 2.528 0 0 1-2.521-2.52 2.528 2.528 0 0 1 2.521-2.52h6.312a2.527 2.527 0 0 1 2.52.521z" /></svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M11.9 22.8c-1.8 0-3.6-.5-5.2-1.4l-5.7 1.5 1.5-5.6C1.6 15.8 1 14 1 12 1 6 5.9 1 11.9 1S22.8 6 22.8 12 17.9 22.8 11.9 22.8zM6.7 20c1.6.9 3.4 1.4 5.2 1.4 5 0 9-4.1 9-9.1 0-5-4.1-9.1-9.1-9.1C6.8 3.2 2.8 7.3 2.8 12.3c0 1.9.6 3.7 1.6 5.3l-1 3.7 3.3-.9zm8.5-7.3c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.2-.4 0-.1.2-.5.7-.6.9-.1.1-.3.2-.5.1-1-.5-1.9-1-2.6-2.2-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.2-.2.2-.4s0-.3-.1-.5c-.1-.2-.4-.9-.5-1.3-.1-.4-.3-.3-.4-.3-.1 0-.3 0-.4 0-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.4 3.8 3.3.5.2 1 .4 1.3.5.5.2.9.1 1.2.1.4 0 1.3-.5 1.4-1 .1-.5.1-.9 0-1L15.2 12.7z" /></svg>
);

const TICKETS_STORAGE_KEY = "inzira.tickets";
const NOTIF_READ_KEY = "inzira.notifications.read";

function readTicketsCount(email: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!raw) return 0;
    const all = JSON.parse(raw) as { ownerEmail?: string }[];
    return all.filter((t) => t.ownerEmail === email).length;
  } catch {
    return 0;
  }
}

function readUnreadCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(NOTIF_READ_KEY);
    const read = new Set(JSON.parse(raw || "[]") as string[]);
    return notificationFeed.filter((n) => !read.has(n.id)).length;
  } catch {
    return notificationFeed.length;
  }
}

function AccountDashboard({ user }: { user: AuthUser }) {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const [tickets] = useState(() => readTicketsCount(user.email));
  const [unread] = useState(readUnreadCount);
  const [info, setInfo] = useState<string | null>(null);

  const tools = [
    { href: "/tickets", icon: Ticket, label: t("nav.tickets"), desc: t("account.ticketsDesc"), accent: "#0c8a7a" },
    { href: "/notifications", icon: Bell, label: t("nav.notifications"), desc: t("account.notificationsDesc"), accent: "#2563eb" },
    { href: "/predictions", icon: BrainCircuit, label: t("nav.predictions"), desc: t("account.predictionsDesc"), accent: "#7c3aed" },
    { href: "/analytics", icon: BarChart3, label: t("nav.analytics"), desc: t("account.analyticsDesc"), accent: "#d97706" },
    { href: "/fleet", icon: BusFront, label: t("nav.fleet"), desc: t("account.fleetDesc"), accent: "#0d9488" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="hairline-top rounded-[2rem] border border-border/80 bg-card p-8 shadow-[var(--shadow-panel)] sm:p-10">
        <div className="flex flex-wrap items-center gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-bold">{t("auth.accountTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.signedInAs")}</p>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <span className="rounded-lg bg-success/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-success-foreground">
            {t("account.signedInBadge")}
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Ticket className="h-4 w-4 text-primary" /> {t("account.ticketsCount")}
            </div>
            <div className="mt-2 font-display text-3xl font-bold tracking-tight">{tickets}</div>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Bell className="h-4 w-4 text-primary" /> {t("account.unreadCount")}
            </div>
            <div className="mt-2 font-display text-3xl font-bold tracking-tight">{unread}</div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">{t("account.toolsTitle")}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("account.toolsBody")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="hairline-top group rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-panel)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: tool.accent }}>
                <tool.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{tool.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>
            </Link>
          ))}
          <Link
            href="/planner"
            className="hairline-top group rounded-2xl border border-primary/30 bg-primary-soft/40 p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-panel)]"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Navigation className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{t("nav.planTrip")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("account.planDesc")}</p>
          </Link>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button
          onClick={() => { signOut(); setInfo(t("auth.signedOut")); }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> {t("auth.signOut")}
        </button>
        {info && <p className="text-xs text-muted-foreground">{info}</p>}
      </div>
    </div>
  );
}

const PROVIDER_LOADING_LABELS: Record<AuthProviderName, string> = {
  google: "Connecting to Google...",
  instagram: "Connecting to Instagram...",
  linkedin: "Connecting to LinkedIn...",
  slack: "Connecting to Slack...",
  whatsapp: "Connecting to WhatsApp...",
};

export function AuthPage() {
  const { t } = useTranslation();
  const { user, signIn, signUp, signInWithProvider } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<AuthProviderName | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <AccountDashboard user={user} />;
  }

  const socialOptions: Array<{
    key: AuthProviderName;
    label: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
  }> = [
      { key: "google", label: "Continue with Google", description: "Use your Gmail account", icon: <GoogleIcon className="h-5 w-5" />, accent: "#ffffff" },
      { key: "instagram", label: "Continue with Instagram", description: "Use your Instagram account", icon: <InstagramIcon className="h-5 w-5" />, accent: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" },
      { key: "linkedin", label: "Continue with LinkedIn", description: "Use your LinkedIn account", icon: <LinkedinIcon className="h-5 w-5" />, accent: "#0a66c2" },
      { key: "slack", label: "Continue with Slack", description: "Use your Slack workspace", icon: <SlackIcon className="h-5 w-5" />, accent: "#4a154b" },
      { key: "whatsapp", label: "Continue with WhatsApp", description: "Use your WhatsApp account", icon: <WhatsAppIcon className="h-5 w-5" />, accent: "#25d366" },
    ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const rawRedirect = new URL(window.location.href).searchParams.get("redirect");
      const redirectTo = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/";

      if (mode === "in") {
        if (!email || !password) {
          setError(t("auth.errFields"));
          setSubmitting(false);
          return;
        }

        const r = await signIn(email, password);
        if (!r.ok) {
          setError(r.error || t("auth.errInvalid"));
          setSubmitting(false);
          return;
        }

        router.push(redirectTo);
        return;
      }

      if (!name || !email || !password || !confirm) {
        setError(t("auth.errFields"));
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setError(t("auth.errShortPw"));
        setSubmitting(false);
        return;
      }
      if (password !== confirm) {
        setError(t("auth.errMatch"));
        setSubmitting(false);
        return;
      }

      const r = await signUp(name, email, password);
      if (!r.ok) {
        setError(r.error || t("auth.errExists"));
        setSubmitting(false);
        return;
      }

      router.push(redirectTo);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleProvider(provider: AuthProviderName) {
    setError(null);
    setLoadingProvider(provider);

    try {
      const rawRedirect = new URL(window.location.href).searchParams.get("redirect");
      const redirectTo = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/";
      await signInWithProvider(provider, redirectTo);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.";
      setError(message);
      setLoadingProvider(null);
    }
  }

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="hidden lg:block">
        <Logo />
        <h1 className="mt-8 font-display text-5xl font-bold tracking-tight">
          {mode === "in" ? t("auth.signInTitle") : t("auth.signUpTitle")}
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          {mode === "in" ? t("auth.signInBody") : t("auth.signUpBody")}
        </p>
        <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
          {[t("home.features.0.t"), t("home.features.2.t"), t("home.features.4.t"), t("home.features.5.t")].map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-soft text-primary">✓</span>
              <span className="font-medium text-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="hairline-top rounded-[2rem] border border-border/80 bg-card p-8 shadow-[var(--shadow-panel)] sm:p-10">
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="mt-6 inline-flex rounded-xl border border-border bg-background p-1 shadow-sm lg:mt-0">
          <button
            onClick={() => { setMode("in"); setError(null); }}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${mode === "in" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t("auth.tabSignIn")}
          </button>
          <button
            onClick={() => { setMode("up"); setError(null); }}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${mode === "up" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t("auth.tabSignUp")}
          </button>
        </div>

        <h2 className="mt-6 font-display text-2xl font-bold lg:hidden">
          {mode === "in" ? t("auth.signInTitle") : t("auth.signUpTitle")}
        </h2>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "up" && (
            <Field icon={<UserIcon className="h-4 w-4" />} label={t("auth.name")} type="text" value={name} onChange={setName} autoComplete="name" />
          )}
          <Field icon={<Mail className="h-4 w-4" />} label={t("auth.email") || "Email"} type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field icon={<Lock className="h-4 w-4" />} label={t("auth.password")} type="password" value={password} onChange={setPassword} autoComplete={mode === "in" ? "current-password" : "new-password"} />
          {mode === "up" && (
            <Field icon={<Lock className="h-4 w-4" />} label={t("auth.confirm")} type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          )}

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="press w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-60"
          >
            {submitting
              ? (mode === "in" ? "Signing in..." : "Creating account...")
              : (mode === "in" ? t("auth.signIn") : t("auth.signUp"))
            }
          </button>

          <p className="text-center text-xs text-muted-foreground">{t("auth.terms")}</p>
        </form>

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>Or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            {socialOptions.map((option) => {
              const isLoading = loadingProvider === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  disabled={loadingProvider !== null}
                  onClick={() => handleProvider(option.key)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left transition hover:border-primary/40 hover:bg-muted disabled:opacity-60"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{ background: option.accent }}>
                      {option.icon}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {isLoading ? PROVIDER_LOADING_LABELS[option.key] : option.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">{option.description}</span>
                    </span>
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {isLoading ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    ) : (
                      "Go"
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "in" ? (
            <>
              {t("auth.noAccount")}{" "}
              <button onClick={() => { setMode("up"); setError(null); }} className="font-semibold text-primary hover:underline">
                {t("auth.signUp")}
              </button>
            </>
          ) : (
            <>
              {t("auth.haveAccount")}{" "}
              <button onClick={() => { setMode("in"); setError(null); }} className="font-semibold text-primary hover:underline">
                {t("auth.signIn")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon, label, type, value, onChange, autoComplete,
}: {
  icon: React.ReactNode; label: string; type: string; value: string;
  onChange: (v: string) => void; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40">
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}
