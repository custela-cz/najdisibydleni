"use client";

import { B2Header } from "@/components/header";
import { B2MapRow } from "@/components/cards";
import { Icon, PropPhoto, LISTINGS, bPage } from "@/components/shared";

const B2Map = () => (
  <div style={{ position: "relative", width: "100%", height: "100%", background: "#EFEBE1" }}>
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

    {[
      { x: 120, y: 140, p: "5,6 M", n: 3 },
      { x: 290, y: 140, p: "8,4 M", active: true, n: 1 },
      { x: 470, y: 180, p: "14,2 M", n: 6 },
      { x: 670, y: 150, p: "24,5 M", n: 2 },
      { x: 130, y: 320, p: "6,2 M", n: 4 },
      { x: 300, y: 350, p: "9,1 M", n: 8 },
      { x: 460, y: 560, p: "7,4 M", n: 2 },
      { x: 290, y: 720, p: "4,2 M", n: 1 },
      { x: 660, y: 500, p: "12,9 M", n: 3 },
      { x: 100, y: 760, p: "11,3 M", n: 5 },
    ].map((p, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${p.x / 8}%`,
          top: `${p.y / 9}%`,
          transform: "translate(-50%,-100%)",
          background: p.active ? "var(--b-primary)" : "#fff",
          color: p.active ? "var(--b-cream)" : "var(--b-ink)",
          padding: "6px 12px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--b-font)",
          boxShadow: p.active ? "0 10px 24px rgba(0,0,0,.2)" : "0 2px 6px rgba(0,0,0,.12)",
          border: p.active ? "none" : "1px solid var(--b-line)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {p.p}{" "}
        <span style={{ fontSize: 10, opacity: 0.7, fontFamily: "var(--b-mono)" }}>×{p.n}</span>
      </div>
    ))}

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
      <PropPhoto seed={1} style={{ width: 88, height: 80, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            color: "var(--b-accent)",
            fontWeight: 600,
            fontFamily: "var(--b-mono)",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Ověřený makléř
        </div>
        <div
          style={{
            fontFamily: "var(--b-display)",
            fontSize: 15,
            fontWeight: 500,
            marginTop: 2,
            letterSpacing: -0.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Byt 3+kk, Letná
        </div>
        <div style={{ fontSize: 11, color: "var(--b-muted)", marginTop: 2 }}>85 m² · 3. patro · cihla</div>
        <div
          style={{
            fontFamily: "var(--b-display)",
            fontSize: 16,
            fontWeight: 500,
            color: "var(--b-primary)",
            marginTop: 4,
          }}
        >
          8,49 mil. Kč
        </div>
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "var(--b-shadow-sm)",
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--b-line)",
        }}
      >
        <button
          style={{
            width: 40,
            height: 40,
            borderBottom: "1px solid var(--b-line)",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          +
        </button>
        <button style={{ width: 40, height: 40, fontSize: 16, fontWeight: 500 }}>−</button>
      </div>
      <button
        style={{
          width: 40,
          height: 40,
          background: "var(--b-accent)",
          color: "#fff",
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          boxShadow: "var(--b-shadow-sm)",
        }}
        title="Nakreslit oblast"
      >
        <Icon name="edit" size={16} />
      </button>
      <button
        style={{
          width: 40,
          height: 40,
          background: "#fff",
          border: "1px solid var(--b-line)",
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          boxShadow: "var(--b-shadow-sm)",
        }}
        title="Dojezdová mapa"
      >
        <Icon name="pin" size={16} />
      </button>
    </div>

    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        display: "flex",
        gap: 6,
        background: "#fff",
        padding: 4,
        borderRadius: 999,
        boxShadow: "var(--b-shadow-sm)",
        border: "1px solid var(--b-line)",
      }}
    >
      {[
        { l: "Ceny", active: true },
        { l: "Školy" },
        { l: "MHD" },
        { l: "Hluk" },
      ].map((t) => (
        <button
          key={t.l}
          style={{
            padding: "7px 14px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            background: t.active ? "var(--b-primary)" : "transparent",
            color: t.active ? "var(--b-cream)" : "var(--b-ink-2)",
          }}
        >
          {t.l}
        </button>
      ))}
    </div>

    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        background: "rgba(23,24,27,.85)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 12,
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <Icon name="info" size={14} /> Nakreslete vlastní oblast, nebo posouvejte mapou
    </div>
  </div>
);

export default function MapSearchPage() {
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: "#fff",
              borderRadius: 999,
              border: "1px solid var(--b-line)",
            }}
          >
            <Icon name="search" size={15} style={{ color: "var(--b-muted)" }} />
            <span style={{ fontSize: 13, color: "var(--b-ink)" }}>Praha</span>
            <Icon name="x" size={12} style={{ color: "var(--b-muted)" }} />
          </div>
          {[
            { l: "Byt", v: "3+kk, 3+1, 4+1" },
            { l: "Cena", v: "do 12 mil." },
            { l: "Plocha", v: "60 — 140 m²" },
            { l: "Stav", v: "Kdokoli" },
          ].map((f) => (
            <button
              key={f.l}
              style={{
                padding: "8px 14px",
                background: "#fff",
                border: "1px solid var(--b-line)",
                borderRadius: 999,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ color: "var(--b-muted)" }}>{f.l}:</span>
              <span style={{ fontWeight: 500 }}>{f.v}</span>
              <Icon name="chevron-down" size={12} />
            </button>
          ))}
          <button
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
            <Icon name="filter" size={13} /> Další filtry
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center", fontSize: 13 }}>
            <button
              style={{
                color: "var(--b-accent)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon name="bell" size={14} /> Uložit hledání
            </button>
            <div style={{ width: 1, height: 20, background: "var(--b-line)" }} />
            <span style={{ color: "var(--b-muted)" }}>Řadit:</span>
            <button
              style={{
                padding: "6px 12px",
                background: "#fff",
                border: "1px solid var(--b-line)",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Nejnovější <Icon name="chevron-down" size={12} />
            </button>
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
            Byty v&nbsp;Praze,{" "}
            <span style={{ fontStyle: "italic", color: "var(--b-accent)" }}>284</span> nabídek
          </h1>
          <div style={{ fontSize: 14, color: "var(--b-muted)", marginTop: 6 }}>
            Průměr <strong style={{ color: "var(--b-ink)" }}>118 400 Kč/m²</strong> · Pohybujte mapou — výsledky se aktualizují automaticky
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            border: "1px solid var(--b-line)",
            borderRadius: 999,
            padding: 4,
            background: "#fff",
          }}
        >
          {[
            { id: "map", i: "map", l: "Mapa + seznam" },
            { id: "grid", i: "grid", l: "Jen seznam" },
          ].map((v) => (
            <button
              key={v.id}
              style={{
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 500,
                background: v.id === "map" ? "var(--b-ink)" : "transparent",
                color: v.id === "map" ? "#fff" : "var(--b-ink-2)",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name={v.i} size={13} /> {v.l}
            </button>
          ))}
        </div>
      </div>

      {/* Split view */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          height: 900,
        }}
      >
        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {LISTINGS.slice(0, 5).map((l, i) => (
            <B2MapRow
              key={l.id}
              l={l}
              active={i === 1}
              seller={i % 3 === 0 ? "owner" : i % 3 === 1 ? "agent" : "dev"}
            />
          ))}
          <button
            style={{
              padding: 14,
              background: "#fff",
              border: "1px dashed var(--b-line)",
              borderRadius: 16,
              fontSize: 14,
              color: "var(--b-ink-2)",
              fontWeight: 500,
            }}
          >
            Načíst dalších 20 nabídek
          </button>
        </div>

        <div
          style={{
            position: "sticky",
            top: 20,
            alignSelf: "flex-start",
            height: "100%",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid var(--b-line)",
            background: "#E9EEE8",
          }}
        >
          <B2Map />
        </div>
      </div>
    </div>
  );
}
