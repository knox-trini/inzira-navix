"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ticketProducts,
  getTicketProduct,
  issueTicketCode,
  type PurchasedTicket,
  type TicketProduct,
} from "@/data/kigali";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Clock3, Ticket as TicketIcon, X } from "lucide-react";

const TICKETS_KEY = "inzira.tickets";

const VALIDITY_HOURS: Record<TicketProduct["type"], number> = {
  single: 24,
  day: 24,
  week: 24 * 7,
  month: 24 * 30,
  express: 24,
};

function readTickets(): PurchasedTicket[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(TICKETS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function TicketsPage() {
  const { t } = useTranslation();
  const ready = useRequireAuth();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<PurchasedTicket[]>(() => readTickets());
  const [justBought, setJustBought] = useState<PurchasedTicket | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tk = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(tk);
  }, []);

  function buy(product: TicketProduct) {
    if (!user) return;
    const ticket: PurchasedTicket = {
      code: issueTicketCode(),
      productId: product.id,
      purchasedAt: new Date().toISOString(),
      validUntil: new Date(new Date().getTime() + VALIDITY_HOURS[product.type] * 3_600_000).toISOString(),
      ownerEmail: user.email,
    };
    const next = [ticket, ...readTickets()];
    localStorage.setItem(TICKETS_KEY, JSON.stringify(next));
    setTickets(next);
    setJustBought(ticket);
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {t("common.loading")}
        </div>
      </div>
    );
  }

  const bought = justBought ? getTicketProduct(justBought.productId) : null;
  const myTickets = user ? tickets.filter((tk) => tk.ownerEmail === user.email) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("tickets.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("tickets.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("tickets.body")}</p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ticketProducts.map((p) => (
          <div key={p.id} className="hairline-top relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-panel)]">
            <span className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl" style={{ background: p.accent }} />
            <h3 className="font-display text-lg font-bold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-6 flex items-end gap-1.5">
              <span className="font-display text-4xl font-bold tracking-tight">{p.priceRwf.toLocaleString()}</span>
              <span className="pb-1.5 text-sm text-muted-foreground">RWF</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" /> {t("tickets.validFor", { for: p.validFor })}
            </div>
            <button
              onClick={() => buy(p)}
              className="press mt-6 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
            >
              {t("tickets.buy")}
            </button>
          </div>
        ))}
      </div>

      {justBought && bought && (
        <div className="hairline-top mt-10 rounded-[2rem] border border-primary/30 bg-primary-soft/40 p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl font-bold">{t("tickets.purchased")}</div>
                <div className="text-sm text-muted-foreground">
                  {bought.name} · {t("tickets.validUntil")} {new Date(justBought.validUntil).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => setJustBought(null)}
              className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
              aria-label={t("tickets.close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-card p-6 text-center shadow-sm sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t("tickets.code")}</div>
            <div className="mt-2 font-mono text-3xl font-bold tracking-widest text-primary sm:text-4xl">
              {justBought.code}
            </div>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{t("tickets.showToDriver")}</p>
          </div>
        </div>
      )}

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">{t("tickets.myTickets")}</h2>
        {myTickets.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            {t("tickets.noTickets")}
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {myTickets.map((tk) => {
              const product = getTicketProduct(tk.productId);
              const expired = new Date(tk.validUntil).getTime() < now;
              return (
                <li key={tk.code} className="hairline-top flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex items-center gap-4">
                    <div
                      className="grid h-11 w-11 place-items-center rounded-xl text-primary-foreground"
                      style={{ background: product?.accent ?? "var(--primary)" }}
                    >
                      <TicketIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{product?.name ?? tk.productId}</div>
                      <div className="font-mono text-sm text-muted-foreground">{tk.code}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{t("tickets.expires")}</div>
                      <div className="font-medium">{new Date(tk.validUntil).toLocaleDateString()}</div>
                    </div>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        expired ? "bg-destructive/15 text-destructive-foreground" : "bg-success/15 text-success-foreground"
                      }`}
                    >
                      {expired ? t("tickets.expired") : t("tickets.valid")}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
