import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[var(--shadow-glow)] ring-1 ring-black/5 transition-transform duration-300 group-hover:-rotate-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17c3-1 5-4 9-4s6 3 9 4" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="17" cy="17" r="1.5" />
          <path d="M12 3v6" />
          <path d="M9 6l3-3 3 3" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-bold tracking-tight">Inzira Navix</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Transit</span>
      </span>
    </Link>
  );
}
