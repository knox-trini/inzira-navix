export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: Array<{ heading: string; body: string[] }>;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {updated}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      </header>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading} className="hairline-top pt-6">
            <h2 className="font-display text-xl font-bold tracking-tight">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
