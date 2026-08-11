"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Coord, Route, Station } from "@/data/kigali";

type Props = {
  center: Coord;
  zoom?: number;
  stations?: Station[];
  routes?: Route[];
  liveMarkers?: { id: string; coord: Coord; label: string; color: string }[];
  height?: string;
  highlightStationId?: string;
  origin?: Coord | null;
  destination?: Coord | null;
  focus?: Coord | null;
  selectedLocationLabel?: string | null;
  onDestinationChange?: (c: Coord) => void;
};

const NEON_GREEN = "oklch(0.68 0.18 165)";
const NEON_ORANGE = "oklch(0.74 0.19 45)";

function makeStationIcon(highlight: boolean) {
  const size = highlight ? 26 : 20;
  const color = highlight ? NEON_ORANGE : NEON_GREEN;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:9999px;
        background:${color};
        border:2.5px solid #ffffff;
        box-shadow:0 2px 8px rgba(0,0,0,.3);
        display:grid;place-items:center;
      ">
        <span style="width:6px;height:6px;border-radius:9999px;background:#ffffff;"></span>
      </div>
    `,
  });
}

function makeBusIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    iconSize: [46, 28],
    iconAnchor: [23, 14],
    html: `
      <div style="
        display:inline-flex;align-items:center;gap:4px;
        padding:3px 8px;border-radius:9999px;
        background:${color};color:#ffffff;
        font:600 11px/1 'Inter',sans-serif;
        box-shadow:0 4px 12px rgba(0,0,0,.22);
        border:2px solid #ffffff;
        white-space:nowrap;
      ">
        <span style="width:6px;height:6px;border-radius:9999px;background:#ffffff;"></span>
        ${label}
      </div>
    `,
  });
}

function makeDestinationIcon() {
  return L.divIcon({
    className: "",
    iconSize: [28, 38],
    iconAnchor: [14, 36],
    html: `
      <div style="position:relative;width:28px;height:38px;">
        <div style="
          position:absolute;left:6px;top:0;width:16px;height:16px;border-radius:9999px;
          background:${NEON_ORANGE};
          border:3px solid #ffffff;
          box-shadow:0 0 0 4px rgba(255,140,0,.25),0 4px 12px rgba(0,0,0,.35);
        "></div>
        <div style="
          position:absolute;left:11px;top:14px;width:6px;height:20px;
          background:${NEON_ORANGE};border-radius:0 0 4px 4px;
          box-shadow:0 6px 12px rgba(0,0,0,.25);
        "></div>
      </div>
    `,
  });
}

function Recenter({ center, zoom, focus }: { center: Coord; zoom: number; focus?: Coord | null }) {
  const map = useMap();
  useEffect(() => {
    if (focus) {
      map.flyTo([focus.lat, focus.lng], Math.max(zoom, 14), { duration: 1.1 });
    } else {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [focus, focus?.lat, focus?.lng, center.lat, center.lng, zoom, map]);
  return null;
}

function ClickHandler({ onDestinationChange }: { onDestinationChange?: (c: Coord) => void }) {
  useMapEvents({
    click(e) {
      onDestinationChange?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function MapInner({
  center,
  zoom = 13,
  stations = [],
  routes = [],
  liveMarkers = [],
  height = "480px",
  highlightStationId,
  origin = null,
  destination = null,
  focus = null,
  selectedLocationLabel = null,
  onDestinationChange,
}: Props) {
  const { t } = useTranslation();
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-border/80 shadow-[var(--shadow-panel)]"
      style={{ height }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <Recenter center={center} zoom={zoom} focus={focus} />
        <ClickHandler onDestinationChange={onDestinationChange} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {routes.map((r, i) => (
          <Polyline
            key={r.id}
            positions={r.path.map((p) => [p.lat, p.lng] as [number, number])}
            pathOptions={{
              color: i % 2 === 0 ? NEON_GREEN : NEON_ORANGE,
              weight: 4,
              opacity: 0.85,
            }}
          />
        ))}

        {origin && (
          <>
            <Marker position={[origin.lat, origin.lng]} icon={makeStationIcon(false)} zIndexOffset={600}>
              <Popup>
                <div style={{ fontFamily: "Inter, sans-serif", minWidth: 140 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{t("map.youAreHere")}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                    {origin.lat.toFixed(4)}, {origin.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
            <CircleMarker
              center={[origin.lat, origin.lng]}
              radius={16}
              pathOptions={{ color: NEON_GREEN, opacity: 0.35, fillOpacity: 0.1 }}
            />
          </>
        )}

        {origin && destination && (
          <Polyline
            positions={
              [
                [origin.lat, origin.lng],
                [destination.lat, destination.lng],
              ] as [number, number][]
            }
            pathOptions={{ color: NEON_ORANGE, weight: 3, opacity: 0.9, dashArray: "8 8" }}
          />
        )}

        {stations.map((s) => (
          <Marker
            key={s.id}
            position={[s.coord.lat, s.coord.lng]}
            icon={makeStationIcon(s.id === highlightStationId)}
          >
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{s.area}</div>
                <div style={{ fontSize: 11, marginTop: 6 }}>Routes: {s.routes.length}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={makeDestinationIcon()}
            zIndexOffset={700}
          >
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>
                  {selectedLocationLabel ?? t("mobility.selectedLocation")}
                </div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                  {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {liveMarkers.map((m) => (
          <Marker
            key={m.id}
            position={[m.coord.lat, m.coord.lng]}
            icon={makeBusIcon(NEON_ORANGE, m.label)}
          />
        ))}

        {liveMarkers.map((m) => (
          <CircleMarker
            key={m.id + "-ring"}
            center={[m.coord.lat, m.coord.lng]}
            radius={14}
            pathOptions={{ color: NEON_ORANGE, opacity: 0.35, fillOpacity: 0.1 }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
