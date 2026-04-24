"use client";

import Link from "next/link";
import { use } from "react";
import { BHeader } from "@/components/header";
import { BFooter } from "@/components/footer";
import { Icon, PropPhoto, LISTINGS, bPage } from "@/components/shared";

export default function DetailPage({ params }) {
  const { id } = use(params);
  const listing = LISTINGS.find((x) => String(x.id) === String(id)) || LISTINGS[1];

  return (
    <div className="ab v-b" style={bPage}>
      <BHeader />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 0" }}>
        <Link
          href="/koupit"
          style={{ fontSize: 13, color: "var(--b-muted)", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Icon name="chevron-left" size={13} /> Zpět na výsledky
        </Link>
      </div>

      {/* Hero gallery */}
      <div style={{ maxWidth: 1280, margin: "16px auto 0", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 8,
            borderRadius: 20,
            overflow: "hidden",
            height: 520,
          }}
        >
          <PropPhoto seed={listing.seed} style={{ height: "100%" }} />
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 8 }}>
            <PropPhoto seed={listing.seed + 1} />
            <div style={{ position: "relative" }}>
              <PropPhoto seed={listing.seed + 2} style={{ height: "100%" }} />
              <button
                style={{
                  position: "absolute",
                  inset: 8,
                  background: "rgba(23,24,27,.7)",
                  color: "#fff",
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Icon name="camera" size={15} /> Zobrazit všech 28 fotek
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section
        style={{
          maxWidth: 1280,
          margin: "48px auto 0",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 48,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "var(--b-muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="pin" size={13} /> {listing.place}
          </div>
          <h1
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 56,
              lineHeight: 1.02,
              fontWeight: 400,
              margin: "12px 0 0",
              letterSpacing: -1.5,
            }}
          >
            {listing.title}
          </h1>
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: 28,
              paddingTop: 28,
              borderTop: "1px solid var(--b-line-2)",
            }}
          >
            {[
              { l: "Plocha", v: `${listing.area} m²` },
              { l: "Pokojů", v: listing.disp },
              { l: "Pozemek", v: "620 m²" },
              { l: "Rok", v: "2014" },
              { l: "Energie", v: "B" },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: "var(--b-display)", fontSize: 28, fontWeight: 500 }}>{s.v}</div>
                <div style={{ fontSize: 12, color: "var(--b-muted)", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <h2
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 28,
                fontWeight: 400,
                margin: "0 0 12px",
                letterSpacing: -0.5,
              }}
            >
              O této nemovitosti
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--b-ink-2)" }}>
              {listing.title} v lokalitě {listing.place}. Prosluněný interiér, kvalitní dispozice a velmi dobrá občanská vybavenost. {listing.meta}.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--b-ink-2)" }}>
              Trvalé vytápění plynem, podlahové topení v přízemí. Kompletní technický stav je doložen revizemi a energetickým štítkem.
            </p>
          </div>

          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {["Zahrada", "Krb", "Podlahovka", "Garáž", "Sklep", "Terasa", "Sauna", "Fotovoltaika"].map((f) => (
              <div
                key={f}
                style={{
                  padding: "14px 16px",
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid var(--b-line)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Contact card */}
        <aside>
          <div
            style={{
              position: "sticky",
              top: 24,
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              border: "1px solid var(--b-line)",
            }}
          >
            <div style={{ fontSize: 13, color: "var(--b-muted)" }}>Cena</div>
            <div
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 40,
                fontWeight: 400,
                color: "var(--b-primary)",
                letterSpacing: -1,
              }}
            >
              {listing.price}
            </div>
            <div style={{ fontSize: 13, color: "var(--b-muted)" }}>
              {Math.round(parseInt(listing.price.replace(/\D/g, "")) / listing.area).toLocaleString("cs-CZ")} Kč/m² · ověřený makléř
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: "12px 0",
                borderTop: "1px solid var(--b-line-2)",
                borderBottom: "1px solid var(--b-line-2)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  background: "var(--b-cream)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--b-display)",
                  fontSize: 18,
                }}
              >
                KT
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>Kateřina Trnková</div>
                <div style={{ fontSize: 12, color: "var(--b-muted)" }}>Makléřka · Ověřená přes BankID</div>
              </div>
            </div>

            <button
              style={{
                marginTop: 20,
                width: "100%",
                padding: 14,
                background: "var(--b-primary)",
                color: "var(--b-cream)",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Napsat Kateřině
            </button>
            <button
              style={{
                marginTop: 10,
                width: "100%",
                padding: 14,
                background: "#fff",
                border: "1px solid var(--b-line)",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Rezervovat prohlídku
            </button>
          </div>
        </aside>
      </section>
      <BFooter />
    </div>
  );
}
