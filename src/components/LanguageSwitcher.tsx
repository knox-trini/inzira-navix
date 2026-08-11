"use client";

import { useEffect, useState, useRef } from "react";
import { Check, Globe, ChevronDown } from "lucide-react";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";
import { useHydrated } from "@/hooks/useHydrated";

export type LangCode = "en" | "rw" | "fr" | "sw";

type Lang = { code: LangCode; label: string; native: string; flag: string };

export const LANGUAGES: Lang[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "rw", label: "Kinyarwanda", native: "Ikinyarwanda", flag: "🇷🇼" },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "sw", label: "Kiswahili", native: "Kiswahili", flag: "🇰🇪" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { t, i18n: i18nInstance } = useTranslation();
  const [open, setOpen] = useState(false);
  const mounted = useHydrated();
  const ref = useRef<HTMLDivElement | null>(null);
  const lang = (i18nInstance.language?.slice(0, 2) as LangCode) || "en";

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const select = (code: LangCode) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.label")}
        title={t("language.label")}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Globe className="h-[16px] w-[16px] text-muted-foreground" />
        <span className="hidden sm:inline">{mounted ? current.native : t("language.label")}</span>
        <span className="text-base leading-none sm:hidden" aria-hidden>
          {current.flag}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("language.choose")}
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover/95 p-1 text-popover-foreground shadow-[var(--shadow-panel)] backdrop-blur-xl"
        >
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("language.choose")}
          </div>
          {LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <button
                key={l.code}
                role="option"
                aria-selected={selected}
                onClick={() => select(l.code)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  selected ? "bg-muted text-foreground" : "hover:bg-muted/70 text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base leading-none" aria-hidden>{l.flag}</span>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="font-medium">{l.native}</span>
                    <span className="text-[11px] text-muted-foreground">{l.label}</span>
                  </span>
                </span>
                {selected && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
