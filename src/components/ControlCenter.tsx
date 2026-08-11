"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Bus,
  Clock3,
  Cpu,
  Gauge,
  MapPin,
  Navigation,
  Radar,
  Radio,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  fleet,
  hourRidership,
  networkLevel,
  notificationFeed,
  operatorStats,
  routes,
  routeOnTimeRate,
} from "@/data/kigali";

const BG = "#05140d";
const PANEL = "rgba(9, 34, 24, 0.82)";
const LINE = "rgba(110, 235, 170, 0.14)";
const ORANGE = "#ff8a1e";
const ORANGE_HI = "#ffab52";
const MUTED = "rgba(195, 240, 214, 0.55)";
const TXT = "#f2fff8";

function r(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function relativeTime(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h`;
}

function panel(icon: ReactNode, title: string, children: ReactNode, right?: ReactNode) {
  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: LINE, background: PANEL, backdropFilter: "blur(10px)" }}>
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: LINE }}>
        <div className="flex items-center gap-2.5 text-[13px] font-semibold" style={{ color: TXT }}>
          <span className="text-[#ff8a1e]">{icon}</span>
          {title}
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function KpiCard(props: { icon: ReactNode; label: string; value: string; sub: string; data: number[]; color: string }) {
  const { icon, label, value, sub, data, color } = props;
  const w = 120;
  const h = 34;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${((i * w) / (data.length - 1)).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`)
    .join(" ");
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-4"
      style={{ borderColor: LINE, background: PANEL, backdropFilter: "blur(10px)" }}
    >
      <div className="flex items-center gap-2 text-[11px] font-medium" style={{ color: MUTED }}>
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums" style={{ color: TXT }}>
        {value}
      </div>
      <div className="mt-0.5 text-[11px]" style={{ color: MUTED }}>
        {sub}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-8 w-full" preserveAspectRatio="none" aria-hidden>
        <polyline points={pts} fill="none" stroke={color} strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={pts.split(" ").pop()!.split(",")[0]} cy={pts.split(" ").pop()!.split(",")[1]} r={2.2} fill={color} />
      </svg>
    </div>
  );
}

function Slider(props: { label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  const { label, value, min, max, unit, onChange } = props;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium" style={{ color: "#c9f0da" }}>
          {label}
        </span>
        <span className="font-mono font-semibold" style={{ color: ORANGE_HI }}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="control-slider mt-2"
        aria-label={label}
      />
    </div>
  );
}

function Toggle(props: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  const { label, on, onChange } = props;
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-3 text-[11px]"
      aria-pressed={on}
    >
      <span className="font-medium" style={{ color: "#c9f0da" }}>
        {label}
      </span>
      <span
        className="relative h-[18px] w-[34px] rounded-full transition-colors duration-200"
        style={{ background: on ? "rgba(255,138,30,0.85)" : "rgba(110,235,170,0.22)", boxShadow: on ? "0 0 12px rgba(255,138,30,0.35)" : "none" }}
      >
        <span
          className="absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-transform duration-200"
          style={{ left: on ? 18 : 2 }}
        />
      </span>
    </button>
  );
}

function Donut() {
  const active = fleet.filter((b) => b.status === "active").length;
  const idle = fleet.filter((b) => b.status === "idle").length;
  const maint = fleet.filter((b) => b.status === "maintenance").length;
  const total = Math.max(active + idle + maint, 1);
  const R = 42;
  const C = 2 * Math.PI * R;
  const segs = [
    { v: active, color: "#ff8a1e", label: "Active" },
    { v: idle, color: "#38bdf8", label: "Idle" },
    { v: maint, color: "#7c3aed", label: "Maintenance" },
  ];
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 110 110" className="h-28 w-28 shrink-0" aria-hidden>
        <circle cx={55} cy={55} r={R} fill="none" stroke="rgba(110,235,170,0.12)" strokeWidth={12} />
        {segs.map((s) => {
          const len = (s.v / total) * C;
          const el = (
            <circle
              key={s.label}
              cx={55}
              cy={55}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={12}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 55 55)"
              strokeLinecap="round"
            />
          );
          offset += len;
          return el;
        })}
        <text x={55} y={53} textAnchor="middle" fill={TXT} fontSize={20} fontWeight={700}>
          {total}
        </text>
        <text x={55} y={68} textAnchor="middle" fill={MUTED} fontSize={8.5}>
          Buses
        </text>
      </svg>
      <ul className="space-y-2 text-[11px]">
        {segs.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-6">
            <span className="inline-flex items-center gap-2" style={{ color: MUTED }}>
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-mono font-semibold tabular-nums" style={{ color: TXT }}>
              {s.v}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HeroCity() {
  const VW = 1440;
  const VH = 520;
  const G = 84;
  const cols = Math.ceil(VW / G);
  const rows = Math.ceil(VH / G);

  const scene = useMemo(() => {
    const blocks: ReactNode[] = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const key = `b-${i}-${j}`;
        const river = Math.abs(i * G - j * G * 0.42 - VW * 0.44) < 48;
        if (river) continue;
        const inset = 9;
        const x = i * G + inset;
        const y = j * G + inset;
        const w = G - inset * 2;
        const h = G - inset * 2;
        const rx = r(key + "x") * 12 - 6;
        const ry = r(key + "y") * 12 - 6;
        const shrink = 0.22 + r(key + "s") * 0.55;
        const bw = w * shrink;
        const bh = h * shrink;
        const bx = x + (w - bw) / 2 + rx;
        const by = y + (h - bh) / 2 + ry;
        const light = r(key + "l");
        const fill = light > 0.84 ? "#0f2b1c" : light > 0.52 ? "#0a2115" : "#061910";
        const warm = light > 0.92;
        blocks.push(
          <rect
            key={key}
            x={bx}
            y={by}
            width={bw}
            height={bh}
            rx={2.5}
            fill={fill}
            stroke={warm ? "rgba(255,138,30,0.14)" : "rgba(120,235,175,0.05)"}
            strokeWidth={1}
          />,
        );
      }
    }

    const vRoads: ReactNode[] = [];
    const hRoads: ReactNode[] = [];
    for (let i = 0; i <= cols; i++) {
      const x = i * G;
      const dash = r("rv" + i) > 0.68;
      const nearRiver = Math.abs(x - VW * 0.44) < 26;
      vRoads.push(
        <g key={`v${i}`}>
          <line x1={x} y1={0} x2={x} y2={VH} stroke="rgba(255,138,30,0.13)" strokeWidth={9} />
          <line x1={x} y1={0} x2={x} y2={VH} stroke="#ff8a1e" strokeWidth={2} opacity={0.72} className={dash ? "traffic-dash" : ""} />
          <line x1={x} y1={0} x2={x} y2={VH} stroke="#ffd9ae" strokeWidth={0.6} opacity={0.4} className={dash ? "traffic-dash-slow" : ""} />
          {nearRiver && <rect x={x - 14} y={VH * 0.46 - 9} width={28} height={18} rx={3} fill="#123a28" stroke="rgba(255,138,30,0.3)" />}
        </g>,
      );
    }
    for (let j = 0; j <= rows; j++) {
      const y = j * G;
      const dash = r("rh" + j) > 0.68;
      hRoads.push(
        <g key={`h${j}`}>
          <line x1={0} y1={y} x2={VW} y2={y} stroke="rgba(255,138,30,0.13)" strokeWidth={9} />
          <line x1={0} y1={y} x2={VW} y2={y} stroke="#ff8a1e" strokeWidth={2} opacity={0.72} className={dash ? "traffic-dash" : ""} />
          <line x1={0} y1={y} x2={VW} y2={y} stroke="#ffd9ae" strokeWidth={0.6} opacity={0.4} className={dash ? "traffic-dash-slow" : ""} />
        </g>,
      );
    }

    const pins: ReactNode[] = [];
    let n = 0;
    for (let j = 1; j < rows; j++) {
      for (let i = 1; i < cols; i++) {
        if (r(`j${i}-${j}`) > 0.62) {
          const o = r(`o${n++}`) * 16 - 8;
          pins.push(<circle key={`j${i}-${j}`} cx={i * G + o} cy={j * G + o} r={2.1} fill="#ffb266" className="pin-orange" />);
        }
      }
    }

    return { blocks, vRoads, hRoads, pins };
  }, [cols, rows]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <radialGradient id="cc-core" cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#0d2b1d" />
            <stop offset="55%" stopColor="#071c13" />
            <stop offset="100%" stopColor="#05140d" />
          </radialGradient>
          <linearGradient id="cc-river" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a2e24" />
            <stop offset="100%" stopColor="#0d3d30" />
          </linearGradient>
          <filter id="cc-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <rect width={VW} height={VH} fill="url(#cc-core)" />

        {/* river */}
        <polygon
          points={`${VW * 0.44 - 46},0 ${VW * 0.44 + 62},0 ${VW * 0.44 + 18},${VH} ${VW * 0.44 - 90},${VH}`}
          fill="url(#cc-river)"
          stroke="rgba(120,230,190,0.1)"
          strokeWidth={1}
        />

        {scene.blocks}
        <rect width={VW} height={VH} fill="rgba(5,20,13,0.18)" filter="url(#cc-soft)" />
        {scene.vRoads}
        {scene.hRoads}
        {scene.pins}
      </svg>

      {/* neon grid overlay */}
      <div className="map-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(3,12,7,0.7) 100%)" }} />
    </div>
  );
}

export function ControlCenter() {
  const [peakThreshold, setPeakThreshold] = useState(82);
  const [density, setDensity] = useState(64);
  const [speedLimit, setSpeedLimit] = useState(40);
  const [autoRoute, setAutoRoute] = useState(true);
  const [incidentAlerts, setIncidentAlerts] = useState(true);
  const [nightGrid, setNightGrid] = useState(true);
  const [dataStream, setDataStream] = useState(false);

  const fleetCounts = useMemo(() => {
    const active = fleet.filter((b) => b.status === "active").length;
    const idle = fleet.filter((b) => b.status === "idle").length;
    const maint = fleet.filter((b) => b.status === "maintenance").length;
    return { active, idle, maint };
  }, []);

  const passengersToday = hourRidership.reduce((a, x) => a + x.ridership, 0);
  const avgOnTime = Math.round(fleet.reduce((a, b) => a + b.onTimeRate, 0) / Math.max(fleet.length, 1));
  const congestion = networkLevel(new Date());

  const ridership = hourRidership.map((x) => x.ridership);
  const maxRide = Math.max(...ridership);
  const areaPts = ridership
    .map((v, i) => `${((i * 680) / 23).toFixed(1)},${(168 - (v / maxRide) * 148).toFixed(1)}`)
    .join(" ");
  const areaLine = `M ${areaPts} L 680,168 L 0,168 Z`;

  const onTimeByRoute = routes.map((rt, i) => ({ n: rt.number, v: routeOnTimeRate(rt.id), k: i }));
  const maxTrips = Math.max(...operatorStats.map((o) => o.trips));

  const feedTypeColor: Record<string, string> = {
    delay: "#ff8a1e",
    incident: "#fb7185",
    service: "#4ade80",
    eta: "#38bdf8",
    info: "#38bdf8",
  };
  const feed = notificationFeed.slice(0, 5);

  return (
    <div
      className="overflow-hidden rounded-3xl border p-2 sm:p-3"
      style={{ borderColor: LINE, background: BG }}
    >
      {/* ── Hero: aerial night city ─────────────────────────────────── */}
      <div className="relative h-[420px] overflow-hidden rounded-2xl border sm:h-[500px]" style={{ borderColor: LINE }}>
        <HeroCity />

        {/* top bar */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 sm:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ borderColor: "rgba(255,138,30,0.4)", color: ORANGE_HI, background: "rgba(255,138,30,0.08)" }}>
              <Radio className="h-3 w-3" />
              Inzira Navix · Command
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-4xl" style={{ color: TXT }}>
              Kigali City Control Center
            </h2>
            <p className="mt-1.5 max-w-md text-[13px] leading-relaxed sm:text-sm" style={{ color: MUTED }}>
              Live transit telemetry across {routes.length} corridors — fleet, ridership, congestion and incident response in one console.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: "rgba(74,222,128,0.4)", color: "#4ade80", background: "rgba(74,222,128,0.08)" }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ade80]" />
              Live
            </span>
            <div className="hidden items-center gap-1 rounded-xl border p-1 sm:flex" style={{ borderColor: LINE, background: "rgba(4,18,12,0.6)" }}>
              <button type="button" className="grid h-7 w-7 place-items-center rounded-lg text-[#c9f0da] hover:bg-[rgba(255,138,30,0.14)] hover:text-[#ffab52]">
                +
              </button>
              <div className="h-4 w-px" style={{ background: LINE }} />
              <button type="button" className="grid h-7 w-7 place-items-center rounded-lg text-[#c9f0da] hover:bg-[rgba(255,138,30,0.14)] hover:text-[#ffab52]">
                −
              </button>
              <div className="h-4 w-px" style={{ background: LINE }} />
              <div className="relative mr-1 grid h-7 w-7 place-items-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff8a1e]">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* bottom stat strip */}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-4 sm:p-5">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {[
              { icon: <Bus className="h-3.5 w-3.5" />, label: "Active fleet", value: fleetCounts.active, color: "#4ade80" },
              { icon: <Users className="h-3.5 w-3.5" />, label: "On board", value: passengersToday.toLocaleString(), color: "#38bdf8" },
              { icon: <Gauge className="h-3.5 w-3.5" />, label: "Congestion", value: congestion, color: "#ffab52" },
            ].map((s) => (
              <span key={s.label} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 backdrop-blur" style={{ borderColor: LINE, background: "rgba(4,18,12,0.72)" }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
                  {s.label}
                </span>
                <span className="text-sm font-bold capitalize tabular-nums" style={{ color: TXT }}>
                  {s.value}
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#ff8a1e,#ff6a00)", boxShadow: "0 8px 24px -8px rgba(255,138,30,0.6)" }}
            >
              <Navigation className="h-4 w-4" />
              Open command center
            </button>
            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold backdrop-blur sm:inline-flex"
              style={{ borderColor: LINE, color: "#c9f0da", background: "rgba(8,26,18,0.72)" }}
            >
              <Settings2 className="h-4 w-4" />
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────────── */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={<Bus className="h-4 w-4" />} label="Active fleet" value={`${fleetCounts.active}`} sub={`${fleet.length} total · ${fleetCounts.idle} idle`} data={fleet.map((b, i) => (b.status === "active" ? 100 + (i * 13) % 40 : 60 + (i * 7) % 30))} color={ORANGE} />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="On-time rate" value={`${avgOnTime}%`} sub="network average today" data={fleet.map((b) => b.onTimeRate)} color="#4ade80" />
        <KpiCard icon={<Users className="h-4 w-4" />} label="Passengers today" value={passengersToday.toLocaleString()} sub="−2.4% vs yesterday" data={ridership} color="#38bdf8" />
        <KpiCard icon={<Activity className="h-4 w-4" />} label="Network level" value={congestion} sub={`${Math.round(maxRide / 12)}% peak load`} data={ridership.map((v, i) => (i % 2 ? v * 0.4 : v * 0.55))} color="#ffab52" />
      </div>

      {/* ── Main grid ────────────────────────────────────────────────── */}
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {/* left column */}
        <div className="space-y-3 lg:col-span-2">
          {panel(
            <TrendingUp className="h-4 w-4" />,
            "Ridership flow — 24 hours",
            <>
              <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px]" style={{ color: MUTED }}>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: ORANGE }} /> Hourly boardings
                </span>
                <span className="ml-auto font-mono tabular-nums">{maxRide.toLocaleString()} peak</span>
                <span className="font-mono tabular-nums">{passengersToday.toLocaleString()} total</span>
              </div>
              <svg viewBox="0 0 680 168" className="w-full" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="cc-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,138,30,0.45)" />
                    <stop offset="100%" stopColor="rgba(255,138,30,0)" />
                  </linearGradient>
                </defs>
                {[0, 42, 84, 126].map((y) => (
                  <line key={y} x1={0} y1={y} x2={680} y2={y} stroke="rgba(110,235,170,0.09)" strokeWidth={1} />
                ))}
                <path d={areaLine} fill="url(#cc-area)" />
                <polyline points={areaPts} fill="none" stroke="#ff8a1e" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                <circle cx={680} cy={168 - (ridership[23] / maxRide) * 148} r={3} fill="#ffab52" className="flow-pulse" />
              </svg>
              <div className="mt-2 flex justify-between text-[10px] font-mono" style={{ color: MUTED }}>
                {["00", "04", "08", "12", "16", "20", "24"].map((h) => (
                  <span key={h}>{h}:00</span>
                ))}
              </div>
            </>,
            <span className="rounded-lg border px-2 py-1 text-[10px] font-mono" style={{ borderColor: LINE, color: "#4ade80" }}>
              AI forecast on
            </span>,
          )}

          {/* corridor heat map widget */}
          {panel(
            <MapPin className="h-4 w-4" />,
            "Corridor heat map",
            <>
              <svg viewBox="0 0 680 220" className="w-full" aria-hidden>
                {Array.from({ length: 10 }).map((_, i) => (
                  <circle key={i} cx={60 + i * 68} cy={40 + ((i * 37) % 150)} r={20 + (i % 3) * 10} fill="none" stroke="rgba(255,138,30,0.14)" strokeWidth={1} />
                ))}
                {[
                  { d: "M 60 110 C 160 40, 260 170, 360 90 S 560 60, 640 130", color: "#ff8a1e", w: 6 },
                  { d: "M 60 40 C 200 150, 300 30, 420 120 S 580 170, 640 70", color: "#38bdf8", w: 4 },
                  { d: "M 90 190 C 200 120, 340 200, 480 120 S 600 30, 640 150", color: "#ff8a1e", w: 3 },
                ].map((c, i) => (
                  <path key={i} d={c.d} fill="none" stroke={c.color} strokeWidth={c.w} strokeLinecap="round" opacity={0.85} className={i === 0 ? "traffic-dash" : ""} />
                ))}
                {[
                  { x: 140, y: 92, l: "Kacyiru" },
                  { x: 310, y: 78, l: "Remera" },
                  { x: 470, y: 118, l: "Kimironko" },
                  { x: 230, y: 158, l: "Nyabugogo" },
                ].map((p) => (
                  <g key={p.l}>
                    <circle cx={p.x} cy={p.y} r={5} fill="#ff8a1e" className="pin-orange" />
                    <circle cx={p.x} cy={p.y} r={2} fill="#fff" />
                    <text x={p.x + 8} y={p.y + 3} fill="#c9f0da" fontSize={9.5} fontWeight={600}>
                      {p.l}
                    </text>
                  </g>
                ))}
                <g>
                  <rect x={500} y={8} width={170} height={58} rx={10} fill="rgba(4,18,12,0.85)" stroke={LINE} />
                  <text x={512} y={26} fill={MUTED} fontSize={9} fontWeight={700} letterSpacing={1}>
                    KIGALI NETWORK
                  </text>
                  <text x={512} y={44} fill="#f2fff8" fontSize={17} fontWeight={700}>
                    {routes.length} corridors
                  </text>
                  <text x={512} y={58} fill="#ffab52" fontSize={9.5}>
                    ▲ 3 hotspots detected
                  </text>
                </g>
              </svg>
            </>,
            <span className="rounded-lg border px-2 py-1 text-[10px]" style={{ borderColor: LINE, color: MUTED }}>
              Z12 · live
            </span>,
          )}

          {/* operator + on-time row */}
          <div className="grid gap-3 sm:grid-cols-2">
            {panel(
              <Zap className="h-4 w-4" />,
              "Trips by operator",
              <>
                <ul className="space-y-3">
                  {operatorStats.map((o) => (
                    <li key={o.operator} className="text-[11px]">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="truncate" style={{ color: "#c9f0da" }}>
                          {o.operator}
                        </span>
                        <span className="font-mono tabular-nums" style={{ color: MUTED }}>
                          {o.trips}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(110,235,170,0.12)" }}>
                        <div className="h-full rounded-full" style={{ width: `${(o.trips / maxTrips) * 100}%`, background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_HI})` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </>,
              <span className="rounded-lg border px-2 py-1 text-[10px] font-mono" style={{ borderColor: LINE, color: "#38bdf8" }}>
                RWF/trip model
              </span>,
            )}
            {panel(
              <Gauge className="h-4 w-4" />,
              "On-time rate by route",
              <>
                <svg viewBox="0 0 300 150" className="w-full" aria-hidden>
                  {[0, 37.5, 75, 112.5, 150].map((y) => (
                    <line key={y} x1={0} y1={y} x2={300} y2={y} stroke="rgba(110,235,170,0.08)" strokeWidth={1} />
                  ))}
                  {onTimeByRoute.map((b, i) => {
                    const x = 6 + i * ((294 - 6) / (onTimeByRoute.length - 1 || 1));
                    const hgt = (b.v / 100) * 150;
                    return (
                      <g key={b.n}>
                        <rect x={x - 7} y={150 - hgt} width={14} height={hgt} rx={4} fill={i % 2 ? "rgba(255,138,30,0.35)" : "rgba(56,189,248,0.35)"} />
                        <text x={x} y={150 - hgt - 6} textAnchor="middle" fill="#c9f0da" fontSize={9} fontWeight={600}>
                          {b.v}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]" style={{ color: MUTED }}>
                  {onTimeByRoute.map((b) => (
                    <span key={b.n} className="font-mono">
                      {b.n}
                    </span>
                  ))}
                </div>
              </>,
              <span className="inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px]" style={{ borderColor: "rgba(74,222,128,0.35)", color: "#4ade80" }}>
                <ShieldCheck className="h-3 w-3" /> {avgOnTime}%
              </span>,
            )}
          </div>
        </div>

        {/* right column — control panel */}
        <div className="space-y-3">
          {panel(
            <Settings2 className="h-4 w-4" />,
            "Control panel",
            <div className="space-y-5">
              <div className="space-y-4">
                <Slider label="Peak alert threshold" value={peakThreshold} min={50} max={100} unit="%" onChange={setPeakThreshold} />
                <Slider label="Route density" value={density} min={0} max={100} unit="%" onChange={setDensity} />
                <Slider label="Speed limit" value={speedLimit} min={20} max={60} unit="km/h" onChange={setSpeedLimit} />
              </div>
              <div className="space-y-3 border-t pt-4" style={{ borderColor: LINE }}>
                <Toggle label="Auto-routing" on={autoRoute} onChange={setAutoRoute} />
                <Toggle label="Incident alerts" on={incidentAlerts} onChange={setIncidentAlerts} />
                <Toggle label="Night grid overlay" on={nightGrid} onChange={setNightGrid} />
                <Toggle label="Raw data stream" on={dataStream} onChange={setDataStream} />
              </div>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#ff8a1e,#ff6a00)", boxShadow: "0 8px 24px -8px rgba(255,138,30,0.6)" }}
              >
                <Cpu className="h-4 w-4" />
                Apply to network
              </button>
            </div>,
            <span className="rounded-lg border px-2 py-1 text-[10px]" style={{ borderColor: LINE, color: MUTED }}>
              ops-01
            </span>,
          )}

          {panel(
            <Radar className="h-4 w-4" />,
            "Fleet status",
            <Donut />,
            <span className="inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px]" style={{ borderColor: "rgba(74,222,128,0.35)", color: "#4ade80" }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ade80]" /> synced
            </span>,
          )}

          {panel(
            <AlertTriangle className="h-4 w-4" />,
            "Live feed",
            <ul className="space-y-1">
              {feed.map((n) => {
                const c = feedTypeColor[n.type] ?? "#38bdf8";
                return (
                  <li key={n.id} className="flex items-start gap-2.5 rounded-xl px-2 py-2 hover:bg-[rgba(255,255,255,0.03)]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-medium" style={{ color: "#e0f7ea" }}>
                        {n.title}
                      </div>
<div className="mt-0.5 flex items-center gap-2 text-[10px]" style={{ color: MUTED }} suppressHydrationWarning>
                        <Clock3 className="h-3 w-3" />
                        {relativeTime(n.postedAt)}
                        {n.routeId && <span className="font-mono">{routes.find((x) => x.id === n.routeId)?.number}</span>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>,
            <span className="rounded-lg border px-2 py-1 text-[10px]" style={{ borderColor: LINE, color: MUTED }}>
              {feed.length} events
            </span>,
          )}
        </div>
      </div>
    </div>
  );
}
