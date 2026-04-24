import Link from "next/link";
import { B2Header } from "@/components/header";
import { B2MapRow } from "@/components/cards";
import LeafletMap from "@/components/leaflet-map";
import { Icon, bPage } from "@/components/shared";
import { createClient } from "@/lib/supabase/server";
import { mapRowToListing } from "@/lib/supabase/shared";

export const revalidate = 30;

const TYPE_TO_QUERY = {
  "byt-koupe": { offer: "prodej", ptype: "byt" },
  "dum-koupe": { offer: "prodej", ptype: "dum" },
  "pozemek-koupe": { offer: "prodej", ptype: "pozemek" },
  "chata-koupe": { offer: "prodej", ptype: "chata" },
  novostavba: { offer: "prodej", ptype: "novostavba" },
  "komercni-koupe": { offer: "prodej", ptype: "komercni" },
  "byt-najem": { offer: "pronajem", ptype: "byt" },
  "dum-najem": { offer: "pronajem", ptype: "dum" },
};

const PROPERTY_TYPE_LABEL = {
  byt: "Byty",
  dum: "Domy",
  pozemek: "Pozemky",
  chata: "Chaty a chalupy",
  novostavba: "Novostavby",
  komercni: "Komerční nemovitosti",
};

async function fetchListings(filters) {
  const supabase = await createClient();
  let q = supabase.from("properties").select("*").eq("status", "aktivni");
  if (filters.offer) q = q.eq("offer_type", filters.offer);
  if (filters.ptype) q = q.eq("property_type", filters.ptype);
  if (filters.where) q = q.or(`city.ilike.%${filters.where}%,district.ilike.%${filters.where}%`);
  if (filters.priceMin) q = q.gte("price", filters.priceMin);
  if (filters.priceMax) q = q.lte("price", filters.priceMax);
  if (filters.disp?.length) q = q.in("disposition", filters.disp);
  q = q.order("created_at", { ascending: false }).limit(30);
  const { data, error } = await q;
  if (error) {
    console.error("supabase fetchListings:", error.message);
    return [];
  }
  return (data || []).map(mapRowToListing);
}

function Chip({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        background: "#fff",
        borderRadius: 999,
        border: "1px solid var(--b-line)",
        fontSize: 13,
      }}
    >
      <span style={{ fontWeight: 500, color: "var(--b-ink)" }}>{label}</span>
    </div>
  );
}

function fmtShort(n) {
  if (!n) return "";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} mil.`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString("cs-CZ")} tis.`;
  return n.toLocaleString("cs-CZ");
}

export default async function MapSearchPage({ searchParams }) {
  const params = await searchParams;
  const typeKey = params.type;
  const ptypeOverride = params.ptype;
  const mapped = typeKey && TYPE_TO_QUERY[typeKey] ? TYPE_TO_QUERY[typeKey] : {};
  const offer = mapped.offer || (ptypeOverride === undefined ? "prodej" : undefined);
  const ptype = ptypeOverride || mapped.ptype;

  const where = params.where || "";
  const priceRange = params.price || "";
  const [priceMin, priceMax] = priceRange
    ? priceRange.split("-").map((v) => (v ? parseInt(v, 10) : null))
    : [null, null];
  const disp = params.disp ? params.disp.split(",").filter(Boolean) : [];

  const listings = await fetchListings({
    offer,
    ptype,
    where,
    priceMin,
    priceMax,
    disp,
  });

  const titleLeft = ptype ? PROPERTY_TYPE_LABEL[ptype] : "Všechny nabídky";
  const isRent = offer === "pronajem";

  const mapMarkers = listings
    .filter((l) => l.latitude != null && l.longitude != null)
    .map((l, i) => ({
      id: l.id,
      title: l.title,
      place: l.place,
      price: l.price,
      rawPrice: l.rawPrice,
      latitude: l.latitude,
      longitude: l.longitude,
      active: i === 0,
    }));

  return (
    <div className="ab v-b" style={bPage}>
      <B2Header active="koupit" />

      {/* Top filter bar */}
      <div style={{ borderBottom: "1px solid var(--b-line-2)", background: "var(--b-bg)" }}>
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {where && <Chip label={where} />}
          {ptype && <Chip label={PROPERTY_TYPE_LABEL[ptype]} />}
          {isRent && <Chip label="Pronájem" />}
          {!isRent && offer === "prodej" && <Chip label="Prodej" />}
          {priceRange && (
            <Chip
              label={
                priceMin && priceMax
                  ? `${fmtShort(priceMin)} – ${fmtShort(priceMax)}`
                  : priceMax
                  ? `do ${fmtShort(priceMax)}`
                  : `od ${fmtShort(priceMin)}`
              }
            />
          )}
          {disp.length > 0 && <Chip label={disp.join(", ")} />}
          <Link
            href="/koupit"
            style={{
              padding: "8px 14px",
              background: "transparent",
              border: "1px dashed var(--b-line)",
              borderRadius: 999,
              fontSize: 13,
              color: "var(--b-accent)",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="filter" size={13} /> Vyčistit filtry
          </Link>
          <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--b-muted)" }}>
            <strong style={{ color: "var(--b-ink)", fontFamily: "var(--b-display)", fontSize: 18 }}>
              {listings.length}
            </strong>{" "}
            {listings.length === 1 ? "nabídka" : listings.length < 5 ? "nabídky" : "nabídek"}
          </div>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "28px 24px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
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
            {titleLeft}
            {where && (
              <>
                {" "}
                <span style={{ fontStyle: "italic", color: "var(--b-accent)" }}>{where}</span>
              </>
            )}
          </h1>
          <div style={{ fontSize: 14, color: "var(--b-muted)", marginTop: 6 }}>
            {isRent ? "Pronájmy" : "Prodeje"} · {listings.length} aktivních inzerátů
            {mapMarkers.length > 0 && ` · ${mapMarkers.length} na mapě`}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px 64px" }}>
        {listings.length === 0 ? (
          <div
            style={{
              padding: 48,
              background: "#fff",
              border: "1px dashed var(--b-line)",
              borderRadius: 20,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 24,
                fontWeight: 400,
                marginBottom: 8,
              }}
            >
              Žádné nabídky neodpovídají filtrům.
            </div>
            <div style={{ fontSize: 14, color: "var(--b-muted)", marginBottom: 18 }}>
              Zkuste uvolnit hledání nebo se podívejte na všechny nabídky.
            </div>
            <Link
              href="/koupit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                background: "var(--b-ink)",
                color: "#fff",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Všechny nabídky <Icon name="arrow-right" size={13} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {listings.slice(0, 10).map((l, i) => (
                <B2MapRow key={l.id} l={l} active={i === 0} seller={l.seller_kind || "owner"} />
              ))}
            </div>

            <div
              style={{
                position: "sticky",
                top: 20,
                alignSelf: "flex-start",
                height: 900,
              }}
            >
              {mapMarkers.length > 0 ? (
                <LeafletMap markers={mapMarkers} height={900} />
              ) : (
                <div
                  style={{
                    height: 900,
                    background: "var(--b-bg)",
                    border: "1px dashed var(--b-line)",
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 40,
                    textAlign: "center",
                    fontSize: 14,
                    color: "var(--b-muted)",
                  }}
                >
                  Pro tyto výsledky nejsou k dispozici geosouřadnice — zkuste filtrovat podle města, kde máme více záznamů s geolokací.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
