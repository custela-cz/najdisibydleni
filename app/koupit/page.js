import Link from "next/link";
import { B2Header } from "@/components/header";
import { B2MapRow } from "@/components/cards";
import { Icon, PropPhoto, bPage } from "@/components/shared";
import { supabase, mapRowToListing } from "@/lib/supabase";

export const revalidate = 30;

const TYPE_TO_QUERY = {
  "byt-koupe": { offer: "prodej", ptype: "byt" },
  "dum-koupe": { offer: "prodej", ptype: "dum" },
  "pozemek-koupe": { offer: "prodej", ptype: "pozemek" },
  "chata-koupe": { offer: "prodej", ptype: "chata" },
  "novostavba": { offer: "prodej", ptype: "novostavba" },
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
  const titleWhere = where ? ` v ${where}` : "";
  const isRent = offer === "pronajem";

  return (
    <div className="ab v-b" style={bPage}>
      <B2Header active="koupit" />

      {/* Top filter bar — reflects current params */}
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
            {titleWhere && (
              <>
                {" "}
                <span style={{ fontStyle: "italic", color: "var(--b-accent)" }}>{where}</span>
              </>
            )}
          </h1>
          <div style={{ fontSize: 14, color: "var(--b-muted)", marginTop: 6 }}>
            {isRent ? "Pronájmy" : "Prodeje"} · {listings.length} aktivních inzerátů
          </div>
        </div>
      </div>

      {/* Results */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px 64px",
        }}
      >
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {listings.slice(0, 10).map((l, i) => (
                <B2MapRow
                  key={l.id}
                  l={l}
                  active={i === 0}
                  seller={l.seller_kind || "owner"}
                />
              ))}
            </div>

            <MapPanel listings={listings.slice(0, 10)} />
          </div>
        )}
      </div>
    </div>
  );
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
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} mil.`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString("cs-CZ")} tis.`;
  return n.toLocaleString("cs-CZ");
}

function MapPanel({ listings }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 20,
        alignSelf: "flex-start",
        height: 900,
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid var(--b-line)",
        background: "#EFEBE1",
        position: "relative",
      }}
    >
      <svg
        viewBox="0 0 800 900"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <rect width="800" height="900" fill="#EFEBE1" />
        <rect x="40" y="60" width="160" height="140" fill="#E3DDCC" rx="6" />
        <rect x="220" y="60" width="130" height="140" fill="#E3DDCC" rx="6" />
        <rect x="370" y="60" width="200" height="220" fill="#E3DDCC" rx="6" />
        <rect x="590" y="60" width="170" height="180" fill="#E3DDCC" rx="6" />
        <rect x="40" y="220" width="170" height="180" fill="#E3DDCC" rx="6" />
        <rect x="230" y="220" width="120" height="180" fill="#E3DDCC" rx="6" />
        <rect x="370" y="300" width="200" height="140" fill="#C9D8B8" rx="8" />
        <circle cx="470" cy="370" r="14" fill="#A5BE8B" />
        <circle cx="510" cy="400" r="10" fill="#A5BE8B" />
        <rect x="40" y="420" width="310" height="200" fill="#E3DDCC" rx="6" />
        <rect x="370" y="460" width="200" height="160" fill="#E3DDCC" rx="6" />
        <rect x="590" y="260" width="170" height="360" fill="#E3DDCC" rx="6" />
        <rect x="40" y="640" width="170" height="220" fill="#E3DDCC" rx="6" />
        <rect x="230" y="640" width="330" height="120" fill="#E3DDCC" rx="6" />
        <rect x="230" y="780" width="330" height="80" fill="#E3DDCC" rx="6" />
        <rect x="590" y="640" width="170" height="220" fill="#E3DDCC" rx="6" />
        <path
          d="M-20 440 Q150 420 300 460 T600 480 Q720 490 820 470 L820 540 Q720 555 600 540 T300 520 Q150 490 -20 510 Z"
          fill="#B7CDD6"
        />
      </svg>

      {listings.map((l, i) => {
        const positions = [
          { x: 290, y: 140 }, { x: 120, y: 140 }, { x: 470, y: 180 }, { x: 670, y: 150 },
          { x: 130, y: 320 }, { x: 300, y: 350 }, { x: 460, y: 560 }, { x: 290, y: 720 },
          { x: 660, y: 500 }, { x: 100, y: 760 },
        ];
        const p = positions[i] || positions[0];
        const active = i === 0;
        const priceLabel = l.rawPrice >= 1_000_000
          ? `${(l.rawPrice / 1_000_000).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} mil.`
          : `${Math.round(l.rawPrice / 1000)} tis.`;
        return (
          <Link
            key={l.id}
            href={`/inzerat/${l.id}`}
            style={{
              position: "absolute",
              left: `${p.x / 8}%`,
              top: `${p.y / 9}%`,
              transform: "translate(-50%,-100%)",
              background: active ? "var(--b-primary)" : "#fff",
              color: active ? "var(--b-cream)" : "var(--b-ink)",
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--b-font)",
              boxShadow: active ? "0 10px 24px rgba(0,0,0,.2)" : "0 2px 6px rgba(0,0,0,.12)",
              border: active ? "none" : "1px solid var(--b-line)",
            }}
          >
            {priceLabel}
          </Link>
        );
      })}

      {listings[0] && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            width: 300,
            background: "#fff",
            borderRadius: 16,
            padding: 12,
            boxShadow: "var(--b-shadow)",
            display: "flex",
            gap: 12,
          }}
        >
          <PropPhoto seed={listings[0].seed} style={{ width: 88, height: 80, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: -0.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {listings[0].title}
            </div>
            <div style={{ fontSize: 11, color: "var(--b-muted)", marginTop: 2 }}>
              {listings[0].area} m² · {listings[0].disp}
            </div>
            <div
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 16,
                fontWeight: 500,
                color: "var(--b-primary)",
                marginTop: 4,
              }}
            >
              {listings[0].price}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
