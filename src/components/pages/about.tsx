"use client";

import { useTranslation } from "react-i18next";

export function AboutPage() {
  const { t } = useTranslation();
  const problems = t("about.problems", { returnObjects: true }) as string[];
  const objectives = t("about.objectives", { returnObjects: true }) as string[];
  const audience = t("about.audience", { returnObjects: true }) as string[];
  const phases = t("about.phases", { returnObjects: true }) as { p: string; t: string; items: string[] }[];
  const whyWords = t("about.whyWords", { returnObjects: true }) as string[];
  const techGroups = t("about.techGroups", { returnObjects: true }) as { n: string; items: string[] }[];
  const impactItems = t("about.impactItems", { returnObjects: true }) as string[];
  const growthItems = t("about.growthItems", { returnObjects: true }) as string[];
  const challenges = t("about.challenges", { returnObjects: true }) as string[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("about.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight sm:text-6xl">{t("about.title")}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t("about.intro")}</p>
      </header>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <div className="hairline-top rounded-2xl border border-border/80 bg-card p-7 shadow-[var(--shadow-soft)]">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">{t("about.vision")}</div>
          <p className="mt-3 text-lg font-medium leading-relaxed">{t("about.visionBody")}</p>
        </div>
        <div className="hairline-top rounded-2xl border border-border/80 bg-card p-7 shadow-[var(--shadow-soft)]">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">{t("about.mission")}</div>
          <p className="mt-3 text-lg font-medium leading-relaxed">{t("about.missionBody")}</p>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-display text-3xl font-bold tracking-tight">{t("about.problemTitle")}</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("about.problemBody")}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {problems.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="text-sm font-medium">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">{t("about.objectivesTitle")}</h2>
          <ul className="mt-6 space-y-2.5">
            {objectives.map((o, i) => (
              <li key={o} className="flex items-start gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{i + 1}</span>
                <span className="text-sm font-medium">{o}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">{t("about.audienceTitle")}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {audience.map((a) => (
              <li key={a} className="rounded-xl border border-border/80 bg-card p-4 text-sm font-medium shadow-sm">{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="roadmap" className="mt-20">
        <h2 className="font-display text-3xl font-bold tracking-tight">{t("about.roadmapTitle")}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {phases.map((p, i) => (
            <div key={p.p} className="hairline-top relative rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="font-display text-5xl font-bold text-primary/15">0{i + 1}</div>
              <div className="-mt-6 text-xs font-semibold uppercase tracking-widest text-primary">{p.p}</div>
              <h3 className="mt-1 text-xl font-semibold">{p.t}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-3xl bg-foreground p-10 text-background sm:p-14">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("about.whyTitle")}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {whyWords.map((w) => (
            <div key={w} className="rounded-2xl border border-background/15 bg-background/5 p-5 text-center text-sm font-semibold">
              {w}
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-background/70">{t("about.whyBody")}</p>
      </section>

      <section className="mt-20">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("about.techEyebrow")}
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">{t("about.techTitle")}</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("about.techBody")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techGroups.map((g) => (
            <div key={g.n} className="hairline-top rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">{g.n}</div>
              <ul className="mt-4 space-y-2 text-sm font-medium">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">{t("about.impactTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("about.impactBody")}</p>
          <ul className="mt-6 space-y-2.5">
            {impactItems.map((o, i) => (
              <li key={o} className="flex items-start gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{i + 1}</span>
                <span className="text-sm font-medium">{o}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">{t("about.growthTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("about.growthBody")}</p>
          <ul className="mt-6 space-y-2.5">
            {growthItems.map((g) => (
              <li key={g} className="flex items-start gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span className="text-sm font-medium">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-display text-3xl font-bold tracking-tight">{t("about.challengesTitle")}</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("about.challengesBody")}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {challenges.map((c) => (
            <li key={c} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="text-sm font-medium">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 rounded-3xl bg-foreground p-10 text-background sm:p-14">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-background/60">
          <span className="h-px w-8 bg-background/40" />
          {t("about.conclusionEyebrow")}
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("about.conclusionTitle")}</h2>
        <p className="mt-4 max-w-3xl text-background/70">{t("about.conclusionBody")}</p>
      </section>
    </div>
  );
}
