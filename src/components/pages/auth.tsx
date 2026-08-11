"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { notificationFeed } from "@/data/kigali";
import {
  Mail,
  Lock,
  User as UserIcon,
  LogOut,
  Bell,
  BrainCircuit,
  BarChart3,
  BusFront,
  Ticket,
  Navigation,
} from "lucide-react";

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

export function AuthPage() {
  const { t } = useTranslation();
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <AccountDashboard user={user} />;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawRedirect = new URL(window.location.href).searchParams.get("redirect");
    const redirectTo = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/";
    if (mode === "in") {
      if (!email || !password) return setError(t("auth.errFields"));
      const r = signIn(email, password);
      if (!r.ok) return setError(t("auth.errInvalid"));
      router.push(redirectTo);
    } else {
      if (!name || !email || !password || !confirm) return setError(t("auth.errFields"));
      if (password.length < 6) return setError(t("auth.errShortPw"));
      if (password !== confirm) return setError(t("auth.errMatch"));
      const r = signUp(name, email, password);
      if (!r.ok) return setError(t("auth.errExists"));
      router.push(redirectTo);
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
          <Field icon={<Mail className="h-4 w-4" />} label={t("auth.email")} type="email" value={email} onChange={setEmail} autoComplete="email" />
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
            className="press w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            {mode === "in" ? t("auth.signIn") : t("auth.signUp")}
          </button>

          <p className="text-center text-xs text-muted-foreground">{t("auth.terms")}</p>
        </form>

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
