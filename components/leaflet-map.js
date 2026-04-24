"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// Single-file Leaflet wrapper — we avoid react-leaflet to keep bundle lean
// and avoid server-side rendering issues. Leaflet is loaded dynamically.

export default function LeafletMap({
  markers = [],
  center = [50.0755, 14.4378], // Prague
  zoom = 11,
  height = 900,
  singleActive = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!containerRef.current) return;
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const validMarkers = markers.filter(
        (m) => Number.isFinite(m.latitude) && Number.isFinite(m.longitude)
      );

      let effectiveCenter = center;
      let effectiveZoom = zoom;
      if (validMarkers.length === 1 && singleActive) {
        effectiveCenter = [validMarkers[0].latitude, validMarkers[0].longitude];
        effectiveZoom = 14;
      }

      const map = L.map(containerRef.current, {
        center: effectiveCenter,
        zoom: effectiveZoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const bounds = [];
      validMarkers.forEach((m) => {
        const priceLabel =
          m.rawPrice >= 1_000_000
            ? `${(m.rawPrice / 1_000_000).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} mil.`
            : `${Math.round(m.rawPrice / 1000)} tis.`;
        const color = m.active ? "#1F4336" : "#ffffff";
        const textColor = m.active ? "#EFE8DA" : "#17181B";
        const icon = L.divIcon({
          html: `<div style="
            background:${color};
            color:${textColor};
            padding:6px 12px;
            border-radius:999px;
            font-size:12px;
            font-weight:600;
            font-family:'Work Sans',system-ui,sans-serif;
            box-shadow:${m.active ? "0 10px 24px rgba(0,0,0,.25)" : "0 2px 6px rgba(0,0,0,.15)"};
            border:${m.active ? "none" : "1px solid #E7E3DB"};
            white-space:nowrap;
            transform:translateY(-50%);
          ">${priceLabel}</div>`,
          className: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
        const marker = L.marker([m.latitude, m.longitude], { icon }).addTo(map);
        bounds.push([m.latitude, m.longitude]);
        if (m.id && m.title) {
          marker.bindPopup(
            `<div style="font-family:'Work Sans',system-ui,sans-serif;min-width:180px">
              <div style="font-family:'Libre Caslon Text',serif;font-size:15px;font-weight:500;margin-bottom:4px">${escapeHtml(m.title)}</div>
              <div style="font-size:12px;color:#76787D;margin-bottom:6px">${escapeHtml(m.place || "")}</div>
              <div style="font-family:'Libre Caslon Text',serif;font-size:16px;font-weight:500;color:#1F4336">${escapeHtml(m.price || "")}</div>
              <a href="/inzerat/${m.id}" style="margin-top:8px;display:inline-block;font-size:12px;color:#C9774A;font-weight:500;text-decoration:none">Zobrazit detail →</a>
            </div>`
          );
        }
      });

      if (bounds.length > 1 && !singleActive) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(markers), center[0], center[1], zoom, singleActive]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid var(--b-line)",
          background: "#EFEBE1",
        }}
      />
    </>
  );
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
