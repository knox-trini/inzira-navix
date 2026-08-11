"use client";

import { useTranslation } from "react-i18next";
import {
  Navigation,
  Clock,
  Banknote,
  BusFront,
  ArrowRight,
  TrendingDown,
  Repeat,
  X,
  MapPin,
} from "lucide-react";
import type { MobilityRecommendation } from "@/lib/mobility";

const CONGESTION_COLOR: Record<string, string> = {
  free: "#4ade80",
  light: "#a3e635",
  moderate: "#facc15",
  heavy: "#fb923c",
  severe: "#f87171",
};

export function MobilityPanel({
  rec,
  onClear,
}: {
  rec: MobilityRecommendation | null;
  onClear: () => void;
}) {
  const { t } = useTranslation();

  if (!rec) {
    return (
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-[1100] w-max max-w-[90%] -translate-x-1/2 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-center text-[12px] font-medium text-muted-foreground shadow-[var(--shadow-soft)] backdrop-blur">
        <span className="inline-flex items-center gap-2">
          <Navigation className="h-3.5 w-3.5 text-primary" />
          {t("mobility.tapHint")}
        </span>
      </div>
    );
  }

  const congestion = rec.congestion;
  const congestionLabel = t(`analytics.levels.${congestion}`);

  return (
    <div className="absolute bottom-4 left-1/2 z-[1100] w-[min(94%,440px)] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-border/70 bg-background/95 shadow-[var(--shadow-panel)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {t("mobility.destination")}
            </div>
            <div className="mt-2 text-lg font-bold leading-tight text-foreground">
              {rec.destination.label}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-muted-foreground">
              <span>{t("mobility.nearestStation")}: {rec.nearestStation.label}</span>
              <span>{t("mobility.walk")}: {Math.round(rec.nearestStation.walkKm * 1000)} m</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            aria-label={t("common.clear")}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-3xl bg-card/80 p-3">
          <div className="flex flex-wrap items-center gap-3">
            <RouteBadge number={rec.route?.routeNumber ?? ""} color={rec.route?.color ?? "#0c8a7a"} />
            <span className="text-sm font-semibold text-foreground">{rec.route?.name}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[13px] text-muted-foreground">
            <span>{t("mobility.eta")} {rec.etaMin} {t("routeDetail.min")}</span>
            <span>{t("mobility.travel")} {rec.travelMin} {t("routeDetail.min")}</span>
            <span>{t("mobility.transfers", { count: rec.transfers })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Stat icon={<Clock className="h-4 w-4" />} label={t("mobility.eta")} value={`${rec.etaMin} ${t("routeDetail.min")}`} />
          <Stat icon={<Navigation className="h-4 w-4" />} label={t("mobility.travel")} value={`${rec.travelMin} ${t("routeDetail.min")}`} />
          <Stat icon={<Banknote className="h-4 w-4" />} label={t("mobility.fare")} value={`${rec.fareRwf} RWF`} />
          <Stat icon={<TrendingDown className="h-4 w-4" />} label={t("mobility.congestion")} value={congestionLabel} color={CONGESTION_COLOR[congestion]} />
        </div>
      </div>
    </div>
  );
}

function RouteBadge({ number, color }: { number: string; color: string }) {
  return (
    <span
      className="grid h-8 w-12 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold text-white"
      style={{ background: color }}
    >
      {number}
    </span>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-2.5 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-xs font-bold" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}
