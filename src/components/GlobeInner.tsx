"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { Coord, Route, Station } from "@/data/kigali";
import type { MobilityRecommendation } from "@/lib/mobility";

type Props = {
  center: Coord;
  zoom?: number;
  stations?: Station[];
  routes?: Route[];
  liveMarkers?: { id: string; coord: Coord; label: string; color: string }[];
  height?: string;
  highlightStationId?: string;
  autoRotate?: boolean;
  origin?: Coord | null;
  destination?: Coord | null;
  focus?: Coord | null;
  selectedLocationLabel?: string | null;
  onDestinationChange?: (c: Coord) => void;
  recommendation?: MobilityRecommendation | null;
};

type GlobePoint = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  radius: number;
  name: string;
  area?: string;
};

type GlobePath = {
  id: string;
  color: string;
  coords: [number, number][];
};

const NEON_GREEN = "#3df2b0";
const NEON_ORANGE = "#ff8a1e";

export function GlobeInner({
  center,
  zoom = 13,
  stations = [],
  routes = [],
  liveMarkers = [],
  height = "480px",
  highlightStationId,
  autoRotate = true,
  origin = null,
  destination = null,
  focus = null,
  selectedLocationLabel = null,
  onDestinationChange,
  recommendation = null,
}: Props) {
  const { t } = useTranslation();
  const destinationText = recommendation?.destination.label ?? selectedLocationLabel ?? t("mobility.selectedLocation");
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const rotateTimer = useRef<number | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(900);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(rotateTimer.current), []);

useEffect(() => {
    if (focus && globeRef.current) {
      globeRef.current.pointOfView({ lat: focus.lat, lng: focus.lng, altitude: 1.1 }, 1100);
    }
  }, [focus]);

  const heightNum = Math.max(320, parseFloat(height) || 480);

  const points: GlobePoint[] = [
    ...(origin
      ? [
          {
            id: "map-origin",
            lat: origin.lat,
            lng: origin.lng,
            color: NEON_GREEN,
            radius: 1.8,
            name: t("map.youAreHere"),
          },
        ]
      : []),
...(destination
      ? [
          {
            id: "map-destination",
            lat: destination.lat,
            lng: destination.lng,
            color: NEON_ORANGE,
            radius: 2.8,
            name: destinationText,
            area: recommendation ? `${recommendation.route?.routeNumber ?? ""} · ${recommendation.etaMin} min` : undefined,
          },
        ]
      : []),
    ...stations.map((s) => ({
      id: s.id,
      lat: s.coord.lat,
      lng: s.coord.lng,
      color: s.id === highlightStationId ? NEON_ORANGE : NEON_GREEN,
      radius: s.id === highlightStationId ? 1.6 : 0.9,
      name: s.name,
      area: s.area,
    })),
    ...liveMarkers.map((m) => ({
      id: m.id,
      lat: m.coord.lat,
      lng: m.coord.lng,
      color: NEON_ORANGE,
      radius: 0.8,
      name: m.label,
    })),
  ];

const highlightedRoute = routes.find((r) => recommendation && r.id === recommendation.route?.routeId) ?? null;

  const paths: GlobePath[] = routes.map((r, i) => {
    const isHighlighted = highlightedRoute?.id === r.id;
    return {
      id: r.id,
      color: isHighlighted ? "#ffb266" : i % 2 === 0 ? NEON_GREEN : NEON_ORANGE,
      coords: r.path.map((p) => [p.lat, p.lng] as [number, number]),
    };
  });

  const rings = destination ? [{ lat: destination.lat, lng: destination.lng }] : [];

  const pointerArcs = destination
    ? [
        {
          id: "map-pointer",
          startLat: (origin ?? center).lat,
          startLng: (origin ?? center).lng,
          endLat: destination.lat,
          endLng: destination.lng,
        },
      ]
    : [];

  const povAltitude = Math.max(0.45, 2.2 - (zoom - 11) * 0.35);

  return (
    <div
      ref={wrapRef}
      className="map-dark relative w-full overflow-hidden rounded-2xl border border-border/80 bg-[#08120e] shadow-[var(--shadow-panel)]"
      style={{ height }}
    >
      <Globe
        ref={globeRef}
        width={width}
        height={heightNum}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor={NEON_GREEN}
        atmosphereAltitude={0.22}
        pointsData={points}
        pointLat={(d: object) => (d as GlobePoint).lat}
        pointLng={(d: object) => (d as GlobePoint).lng}
        pointColor={(d: object) => (d as GlobePoint).color}
        pointRadius={(d: object) => ((d as GlobePoint).id === "map-destination" ? 3.8 : (d as GlobePoint).radius)}
        pointAltitude={(d: object) => ((d as GlobePoint).id === "map-destination" ? 0.18 : 0.04)}
        pointResolution={16}
        pointLabel={(d: object) => {
          const p = d as GlobePoint;
          const isDestination = p.id === "map-destination";
          return `<div style="font-weight:700;color:${isDestination ? "#ffddaa" : "#9ff0c4"};font-size:${isDestination ? "16px" : "13px"}">${p.name}</div>${
            p.area ? `<div style="color:${isDestination ? "rgba(255,255,255,.8)" : "rgba(234,255,242,.55)"};margin-top:4px;font-size:11px">${p.area}</div>` : ""
          }`;
        }}
        pathsData={paths}
        pathPoints={(d: object) => (d as GlobePath).coords}
        pathPointLat={(p: unknown) => (p as [number, number])[0]}
        pathPointLng={(p: unknown) => (p as [number, number])[1]}
        pathColor={(d: object) => (d as GlobePath).color}
        pathStroke={1.1}
        pathDashLength={0.18}
        pathDashGap={0.5}
        pathDashAnimateTime={3200}
        pathTransitionDuration={500}
        onGlobeClick={(coords: { lat: number; lng: number }) =>
          onDestinationChange?.({ lat: coords.lat, lng: coords.lng })
        }
        ringsData={rings}
        ringLat={(d: object) => (d as { lat: number }).lat}
        ringLng={(d: object) => (d as { lng: number }).lng}
        ringAltitude={0.1}
        ringColor={() => NEON_ORANGE}
        ringMaxRadius={4}
        ringPropagationSpeed={1.25}
        ringRepeatPeriod={1200}
        arcsData={pointerArcs}
        arcStartLat={(d: object) => (d as { startLat: number }).startLat}
        arcStartLng={(d: object) => (d as { startLng: number }).startLng}
        arcEndLat={(d: object) => (d as { endLat: number }).endLat}
        arcEndLng={(d: object) => (d as { endLng: number }).endLng}
        arcColor={() => NEON_ORANGE}
        arcAltitude={0.35}
        arcStroke={1.8}
        arcDashLength={0.45}
        arcDashGap={0.65}
        arcDashAnimateTime={1400}
        onGlobeReady={() => {
          const instance = globeRef.current;
          if (!instance) return;
          instance.pointOfView(
            { lat: center.lat, lng: center.lng, altitude: povAltitude },
            0
          );
          const controls = instance.controls();
          controls.autoRotate = autoRotate;
          controls.autoRotateSpeed = 0.55;
          controls.enableDamping = true;
          controls.dampingFactor = 0.08;
          controls.addEventListener("start", () => {
            controls.autoRotate = false;
            window.clearTimeout(rotateTimer.current);
          });
          controls.addEventListener("end", () => {
            if (!autoRotate) return;
            rotateTimer.current = window.setTimeout(() => {
              controls.autoRotate = true;
            }, 4000);
          });
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[500] map-grid opacity-60" />

      {destination && (
        <div className="pointer-events-none absolute left-3 top-3 z-[600] rounded-3xl border border-amber-300/20 bg-[#0b1211]/95 px-4 py-3 text-sm font-semibold text-amber-100 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.2em] text-amber-200/70">Selected location</div>
          <div className="mt-1 text-base leading-tight">{destinationText}</div>
        </div>
      )}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[600] rounded-full border border-emerald-200/15 bg-[#0b1713]/80 px-3 py-1.5 text-[11px] font-medium text-emerald-200/90 backdrop-blur">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
