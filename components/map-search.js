"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { mapRowToListing } from "@/lib/supabase/shared";
import { B2MapRow } from "./cards";
import { Icon } from "./shared";
import { CITIES } from "./search-bar";

function foldCz(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Rough bounding box centers for quick map focus when user picks a city.
const CITY_BBOX = {
  praha: { center: [50.0755, 14.4378], zoom: 11 },
  brno: { center: [49.1951, 16.6068], zoom: 11 },
  ostrava: { center: [49.8209, 18.2625], zoom: 11 },
  plzen: { center: [49.7384, 13.3736], zoom: 12 },
  liberec: { center: [50.7663, 15.0543], zoom: 12 },
  olomouc: { center: [49.5938, 17.2509], zoom: 12 },
  "ceske budejovice": { center: [48.9745, 14.4747], zoom: 12 },
  "hradec kralove": { center: [50.2091, 15.8322], zoom: 12 },
  pardubice: { center: [50.0343, 15.7812], zoom: 12 },
  zlin: { center: [49.2264, 17.6707], zoom: 12 },
};

function cityCenter(where) {
  if (!where) return null;
  const key = foldCz(where.split(" — ")[0]);
  return CITY_BBOX[key] || null;
}

const DEFAULT_CENTER = [49.8175, 15.473]; // ČR centroid
const DEFAULT_ZOOM = 7;

export default function MapSearch({ preset = {}, title, subtitle, accent = "var(--b-accent)" }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const supabase = useMemo(() => createClient(), []);

  const [where, setWhere] = useState(sp.get("where") || "");
  const [whereOpen, setWhereOpen] = useState(false);
  const [ptype, setPtype] = useState(sp.get("ptype") || preset.ptype || "");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null);
  const [searchInArea, setSearchInArea] = useState(false);
  const [mapPanned, setMapPanned] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const LRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const whereInputRef = useRef(null);

  const fetchListings = useCallback(
    async (opts = {}) => {
      setLoading(true);
      let q = supabase.from("properties").select("*").eq("status", "aktivni");
      if (preset.offer) q = q.eq("offer_type", preset.offer);
      if (ptype) q = q.eq("property_type", ptype);
      if (preset.ptype && !ptype) q = q.eq("property_type", preset.ptype);
      if (where && !opts.ignoreWhere) {
        q = q.or(`city.ilike.%${where}%,district.ilike.%${where}%`);
      }
      if (opts.bbox) {
        q = q
          .gte("latitude", opts.bbox.south)
          .lte("latitude", opts.bbox.north)
          .gte("longitude", opts.bbox.west)
          .lte("longitude", opts.bbox.east);
      }
      q = q.order("created_at", { ascending: false }).limit(50);
      const { data, error } = await q;
      if (error) console.error("fetch listings:", error.message);
      setListings((data || []).map(mapRowToListing));
      setLoading(false);
    },
    [supabase, preset.offer, preset.ptype, ptype, where]
  );

  // Initial + filter-triggered fetch (ignores bounds unless searchInArea is on)
  useEffect(() => {
    fetchListings(searchInArea && bounds ? { bbox: bounds, ignoreWhere: true } : {});
  }, [fetchListings, searchInArea, bounds]);

  // Init Leaflet map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !mapContainerRef.current) return;
      const initial = cityCenter(where);
      const map = L.map(mapContainerRef.current, {
        center: initial?.center || DEFAULT_CENTER,
        zoom: initial?.zoom || DEFAULT_ZOOM,
        scrollWheelZoom: true,
        zoomControl: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      LRef.current = L;
      setMapReady(true);

      let userHasInteracted = false;
      map.on("movestart", () => {
        userHasInteracted = true;
      });
      map.on("moveend", () => {
        const b = map.getBounds();
        setBounds({
          north: b.getNorth(),
          south: b.getSouth(),
          west: b.getWest(),
          east: b.getEast(),
        });
        if (userHasInteracted) setMapPanned(true);
      });
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      LRef.current = null;
      setMapReady(false);
    };
    // Only once — listener closures use refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-center map when "where" changes (if user picked a known city)
  useEffect(() => {
    if (!mapRef.current) return;
    const target = cityCenter(where);
    if (target) {
      mapRef.current.setView(target.center, target.zoom, { animate: true });
      setMapPanned(false);
    }
  }, [where]);

  // Update markers when listings change
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const positioned = listings.filter(
      (l) => Number.isFinite(l.latitude) && Number.isFinite(l.longitude)
    );
    positioned.forEach((l, i) => {
      const priceLabel =
        l.rawPrice >= 1_000_000
          ? `${(l.rawPrice / 1_000_000).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} mil.`
          : `${Math.round(l.rawPrice / 1000)} tis.`;
      const active = i === 0;
      const color = active ? "#1F4336" : "#ffffff";
      const textColor = active ? "#EFE8DA" : "#17181B";
      const icon = L.divIcon({
        html: `<div style="background:${color};color:${textColor};padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600;font-family:'Work Sans',system-ui,sans-serif;box-shadow:${active ? "0 10px 24px rgba(0,0,0,.25)" : "0 2px 6px rgba(0,0,0,.15)"};border:${active ? "none" : "1px solid #E7E3DB"};white-space:nowrap;transform:translateY(-50%);">${priceLabel}</div>`,
        className: "",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      const marker = L.marker([l.latitude, l.longitude], { icon }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:'Work Sans',system-ui,sans-serif;min-width:200px">
          <div style="font-family:'Libre Caslon Text',serif;font-size:15px;font-weight:500;margin-bottom:4px">${escapeHtml(l.title)}</div>
          <div style="font-size:12px;color:#76787D;margin-bottom:6px">${escapeHtml(l.place || "")}</div>
          <div style="font-family:'Libre Caslon Text',serif;font-size:16px;font-weight:500;color:#1F4336">${escapeHtml(l.price || "")}</div>
          <a href="/inzerat/${l.id}" style="margin-top:8px;display:inline-block;font-size:12px;color:#C9774A;font-weight:500;text-decoration:none">Zobrazit detail →</a>
        </div>`
      );
      markersRef.current.push(marker);
    });
  }, [listings, mapReady]);

  const pickWhere = (c) => {
    setWhere(c);
    setWhereOpen(false);
    setSearchInArea(false);
    setMapPanned(false);
    whereInputRef.current?.blur();
    // Reflect in URL
    const params = new URLSearchParams(sp.toString());
    if (c) params.set("where", c);
    else params.delete("where");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearWhere = () => {
    setWhere("");
    setWhereOpen(false);
    const params = new URLSearchParams(sp.toString());
    params.delete("where");
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const pickPtype = (p) => {
    setPtype(p);
    setSearchInArea(false);
    setMapPanned(false);
    const params = new URLSearchParams(sp.toString());
    if (p) params.set("ptype", p);
    else params.delete("ptype");
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const suggestions = useMemo(() => {
    const q = foldCz(where.trim());
    if (!q) return CITIES.slice(0, 12);
    return CITIES.filter((c) => foldCz(c).includes(q)).slice(0, 12);
  }, [where]);

  const runAreaSearch = () => {
    setWhere("");
    setSearchInArea(true);
    setMapPanned(false);
  };

  const clearAreaSearch = () => {
    setSearchInArea(false);
    setMapPanned(false);
  };

  const propertyTypes = [
    { v: "", l: "Všechny" },
    { v: "byt", l: "Byty" },
    { v: "dum", l: "Domy" },
    { v: "pozemek", l: "Pozemky" },
    { v: "chata", l: "Chaty" },
    { v: "novostavba", l: "Novostavby" },
    { v: "komercni", l: "Komerční" },
  ];

  const positionedCount = listings.filter(
    (l) => Number.isFinite(l.latitude) && Number.isFinite(l.longitude)
  ).length;

  return (
    <div>
      {/* Title */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "28px 24px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 44,
              margin: 0,
              fontWeight: 300,
              letterSpacing: -1.2,
              fontVariationSettings: '"opsz" 144',
            }}
          >
            {title}
            {where && (
              <>
                {" "}
                <span style={{ fontStyle: "italic", color: accent }}>{where}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <div style={{ fontSize: 14, color: "var(--b-muted)", marginTop: 6 }}>{subtitle}</div>
          )}
        </div>
      </div>

      {/* Filter bar: location + property type */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Where */}
        <div style={{ position: "relative", minWidth: 260 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              background: "#fff",
              borderRadius: 999,
              border: "1px solid var(--b-line)",
              boxShadow: "var(--b-shadow-sm)",
            }}
          >
            <Icon name="pin" size={15} style={{ color: "var(--b-muted)", flexShrink: 0 }} />
            <input
              ref={whereInputRef}
              value={where}
              onFocus={() => setWhereOpen(true)}
              onChange={(e) => setWhere(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (suggestions[0]) pickWhere(suggestions[0]);
                }
                if (e.key === "Escape") setWhereOpen(false);
              }}
              placeholder="Lokace — Praha, Brno, Letná…"
              style={{
                flex: 1,
                minWidth: 0,
                border: 0,
                outline: 0,
                background: "transparent",
                padding: 0,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--b-ink)",
                fontFamily: "inherit",
              }}
            />
            {where ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearWhere}
                style={{ color: "var(--b-muted)", padding: 0 }}
              >
                <Icon name="x" size={14} />
              </button>
            ) : (
              <Icon name="chevron-down" size={13} style={{ color: "var(--b-muted)" }} />
            )}
          </div>
          {whereOpen && (
            <>
              <div
                onMouseDown={() => setWhereOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid var(--b-line)",
                  borderRadius: 14,
                  boxShadow: "0 18px 40px -12px rgba(23,24,27,.22)",
                  zIndex: 50,
                  padding: 8,
                  maxHeight: 340,
                  overflowY: "auto",
                }}
              >
                {suggestions.length === 0 && (
                  <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--b-muted)" }}>
                    Žádné lokality neodpovídají.
                  </div>
                )}
                {suggestions.map((c) => (
                  <div
                    key={c}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pickWhere(c);
                    }}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--b-cream)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Icon name="pin" size={13} style={{ color: "var(--b-muted)" }} />
                    <span style={{ flex: 1 }}>{c}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Property type pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {propertyTypes
            .filter((t) => !(preset.ptype && t.v && t.v !== preset.ptype))
            .map((t) => {
              const active = (ptype || preset.ptype || "") === t.v || (!ptype && !t.v);
              return (
                <button
                  key={t.v || "all"}
                  type="button"
                  onClick={() => pickPtype(t.v)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    background: active ? "var(--b-ink)" : "#fff",
                    color: active ? "#fff" : "var(--b-ink-2)",
                    border: "1px solid " + (active ? "var(--b-ink)" : "var(--b-line)"),
                    cursor: "pointer",
                  }}
                >
                  {t.l}
                </button>
              );
            })}
        </div>

        <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--b-muted)" }}>
          {loading ? (
            "Načítám…"
          ) : (
            <>
              <strong style={{ color: "var(--b-ink)", fontFamily: "var(--b-display)", fontSize: 18 }}>
                {listings.length}
              </strong>{" "}
              {listings.length === 1 ? "nabídka" : listings.length < 5 ? "nabídky" : "nabídek"}
              {positionedCount > 0 && positionedCount < listings.length && (
                <> · {positionedCount} na mapě</>
              )}
              {searchInArea && (
                <>
                  {" "}· <button
                    type="button"
                    onClick={clearAreaSearch}
                    style={{ color: "var(--b-accent)", fontWeight: 500, padding: 0 }}
                  >
                    Vypnout hledání na mapě
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Split view: list + map */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "16px 24px 64px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 600 }}>
          {listings.length === 0 && !loading ? (
            <div
              style={{
                padding: 32,
                background: "#fff",
                border: "1px dashed var(--b-line)",
                borderRadius: 20,
                textAlign: "center",
                color: "var(--b-muted)",
              }}
            >
              <div style={{ fontFamily: "var(--b-display)", fontSize: 22, color: "var(--b-ink)", marginBottom: 6 }}>
                Žádné nabídky neodpovídají filtrům.
              </div>
              Zkuste uvolnit lokalitu nebo typ.
            </div>
          ) : (
            listings.slice(0, 20).map((l, i) => (
              <B2MapRow key={l.id} l={l} active={i === 0} seller={l.seller_kind || "owner"} />
            ))
          )}
        </div>

        <div style={{ position: "sticky", top: 20, alignSelf: "flex-start", height: 900 }}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div
              ref={mapContainerRef}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--b-line)",
                background: "#EFEBE1",
              }}
            />
            {/* Floating "Search in this area" button */}
            {mapPanned && !searchInArea && (
              <button
                type="button"
                onClick={runAreaSearch}
                style={{
                  position: "absolute",
                  top: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "10px 20px",
                  background: "var(--b-primary)",
                  color: "var(--b-cream)",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: "0 10px 24px rgba(0,0,0,.2)",
                  zIndex: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icon name="search" size={13} /> Hledat v této oblasti
              </button>
            )}
            {searchInArea && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "8px 16px",
                  background: "rgba(31,67,54,.95)",
                  color: "var(--b-cream)",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  boxShadow: "0 8px 20px rgba(0,0,0,.2)",
                  zIndex: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon name="check" size={12} /> Hledání v této oblasti
              </div>
            )}
            {positionedCount === 0 && !loading && (
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  background: "rgba(23,24,27,.85)",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 12,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  zIndex: 500,
                }}
              >
                <Icon name="info" size={14} /> Tyto nabídky nemají geolokaci — posuňte mapu nebo vyberte jiné filtry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
