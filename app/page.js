"use client";

import Link from "next/link";
import { B2Header } from "@/components/header";
import { B2Footer } from "@/components/footer";
import { B2Card, B2SearchCell } from "@/components/cards";
import { Icon, PropPhoto, LISTINGS, bPage } from "@/components/shared";

export default function HomePage() {
  return (
    <div className="ab v-b" style={bPage}>
      <B2Header />

      {/* Hero */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "72px 32px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div
              style={{
                fontFamily: "var(--b-mono)",
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "var(--b-accent)",
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              Realitní portál · ČR &amp; SK
            </div>
            <h1
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 88,
                lineHeight: 0.92,
                fontWeight: 300,
                margin: 0,
                letterSpacing: -3.5,
                color: "var(--b-ink)",
                fontVariationSettings: '"opsz" 144',
              }}
            >
              Najdete tu<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--b-accent)" }}>byty, domy</span>{" "}
              i pozemky<br />
              po celé ČR.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.5, color: "var(--b-ink-2)", margin: "32px 0 0", maxWidth: 500 }}>
              Soukromí prodejci, realitní makléři i developeři na jednom místě. Aktuálně{" "}
              <strong style={{ color: "var(--b-ink)" }}>128&nbsp;400</strong> nabídek a{" "}
              <strong style={{ color: "var(--b-ink)" }}>3&nbsp;840</strong> ověřených makléřů.
            </p>
          </div>

          {/* Featured */}
          <div style={{ position: "relative" }}>
            <PropPhoto seed={3} style={{ borderRadius: 20, aspectRatio: "4/5" }} />
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                right: 40,
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                boxShadow: "var(--b-shadow)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--b-mono)",
                  fontSize: 10,
                  color: "var(--b-accent)",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Doporučeno
              </div>
              <div
                style={{
                  fontFamily: "var(--b-display)",
                  fontSize: 22,
                  fontWeight: 400,
                  letterSpacing: -0.5,
                  marginTop: 6,
                }}
              >
                Rodinný dům, Říčany
              </div>
              <div style={{ fontSize: 13, color: "var(--b-muted)", marginTop: 2 }}>160 m² · 5+1 · zahrada 620 m²</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: "1px solid var(--b-line-2)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--b-display)",
                    fontSize: 24,
                    fontWeight: 400,
                    letterSpacing: -0.5,
                    color: "var(--b-primary)",
                  }}
                >
                  12,9 mil. Kč
                </div>
                <Link
                  href="/inzerat/2"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    background: "var(--b-accent)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name="arrow-right" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search row */}
        <div
          style={{
            marginTop: 64,
            background: "#fff",
            borderRadius: 24,
            padding: 10,
            boxShadow: "var(--b-shadow)",
            border: "1px solid var(--b-line)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr 1fr 1fr auto",
              alignItems: "center",
            }}
          >
            <B2SearchCell label="Hledám" value="Byt ke koupi" />
            <B2SearchCell label="Kde" value="Praha, Brno, PSČ…" muted />
            <B2SearchCell label="Cena" value="do 10 mil. Kč" />
            <B2SearchCell label="Dispozice" value="2+kk — 3+1" />
            <Link
              href="/koupit"
              style={{
                margin: 4,
                background: "var(--b-primary)",
                color: "var(--b-cream)",
                padding: "0 32px",
                height: 64,
                borderRadius: 16,
                fontSize: 15,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Icon name="search" size={17} /> Hledat
              <span
                style={{
                  fontFamily: "var(--b-mono)",
                  fontSize: 11,
                  padding: "2px 8px",
                  background: "rgba(239,232,218,.2)",
                  borderRadius: 999,
                }}
              >
                2 840
              </span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            paddingTop: 28,
            borderTop: "1px solid var(--b-line-2)",
          }}
        >
          {[
            { n: "128 400+", l: "aktivních nabídek" },
            { n: "4 200", l: "nových každý týden" },
            { n: "3 840", l: "ověřených makléřů" },
            { n: "94 %", l: "inzerátů s virtuální prohlídkou" },
          ].map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontFamily: "var(--b-display)",
                  fontSize: 40,
                  fontWeight: 400,
                  letterSpacing: -1.2,
                  lineHeight: 1,
                  fontVariationSettings: '"opsz" 144',
                }}
              >
                {s.n}
              </div>
              <div style={{ fontSize: 13, color: "var(--b-muted)", marginTop: 6, fontFamily: "var(--b-font)" }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1320, margin: "60px auto 0", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {[
            { i: "building", l: "Byty", c: "24 180", seed: 0 },
            { i: "home", l: "Rodinné domy", c: "8 420", seed: 1 },
            { i: "tree", l: "Pozemky", c: "3 840", seed: 2 },
            { i: "sun", l: "Chaty & chalupy", c: "2 160", seed: 3 },
            { i: "building", l: "Novostavby", c: "1 420", seed: 5 },
            { i: "wave", l: "Komerční", c: "680", seed: 6 },
          ].map((c) => (
            <Link
              key={c.l}
              href="/koupit"
              style={{
                background: "#fff",
                borderRadius: 18,
                border: "1px solid var(--b-line)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <PropPhoto seed={c.seed} style={{ aspectRatio: "4/3" }} />
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontFamily: "var(--b-display)", fontSize: 18, fontWeight: 400, letterSpacing: -0.3 }}>
                  {c.l}
                </div>
                <div style={{ fontSize: 12, color: "var(--b-muted)", fontFamily: "var(--b-mono)", marginTop: 2 }}>
                  {c.c}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section style={{ maxWidth: 1320, margin: "96px auto 0", padding: "0 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--b-mono)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 1.5,
                color: "var(--b-accent)",
                textTransform: "uppercase",
              }}
            >
              Čerstvě přidané
            </div>
            <h2
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 52,
                margin: "10px 0 0",
                fontWeight: 300,
                letterSpacing: -1.5,
                fontVariationSettings: '"opsz" 144',
              }}
            >
              Nově{" "}
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--b-accent)" }}>přidané</span>{" "}
              nabídky
            </h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["Vše", "Praha", "Brno", "Novostavby"].map((t, i) => (
              <button
                key={t}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 500,
                  background: i === 0 ? "var(--b-ink)" : "transparent",
                  color: i === 0 ? "#fff" : "var(--b-ink-2)",
                  border: i === 0 ? "1px solid var(--b-ink)" : "1px solid var(--b-line)",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {LISTINGS.slice(0, 3).map((l, i) => (
            <B2Card key={l.id} l={l} seller={i === 0 ? "owner" : i === 1 ? "agent" : "dev"} />
          ))}
        </div>
      </section>

      {/* Three audiences */}
      <section style={{ maxWidth: 1320, margin: "96px auto 0", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "var(--b-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 1.5,
              color: "var(--b-accent)",
              textTransform: "uppercase",
            }}
          >
            Pro všechny strany trhu
          </div>
          <h2
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 52,
              margin: "10px 0 0",
              fontWeight: 300,
              letterSpacing: -1.5,
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Pokrýváme celý <span style={{ fontStyle: "italic", color: "var(--b-accent)" }}>trh</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            {
              i: "user",
              t: "Kupuji či pronajímám",
              d: "Mapové vyhledávání, uložená hledání, notifikace na nové nabídky a kompletní historie cen.",
              cta: "Začít hledat",
              bg: "#fff",
              color: "var(--b-ink)",
            },
            {
              i: "home",
              t: "Prodávám soukromě",
              d: "Wizard s AI popisem, doporučená cena podle tržních dat, celý průběh online. Bez zbytečných kroků.",
              cta: "Vložit inzerát",
              bg: "var(--b-primary)",
              color: "var(--b-cream)",
            },
            {
              i: "building",
              t: "Jsem makléř či RK",
              d: "Profesionální účet, hromadný import, CRM integrace, analytika a topování. Férové ceny.",
              cta: "Profesionální účet",
              bg: "var(--b-accent)",
              color: "#fff",
            },
          ].map((a) => (
            <div
              key={a.t}
              style={{
                background: a.bg,
                color: a.color,
                borderRadius: 24,
                padding: 32,
                border: a.bg === "#fff" ? "1px solid var(--b-line)" : "none",
                display: "flex",
                flexDirection: "column",
                minHeight: 320,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: a.bg === "#fff" ? "var(--b-cream)" : "rgba(255,255,255,.15)",
                  color: a.bg === "#fff" ? "var(--b-primary)" : a.color,
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 20,
                }}
              >
                <Icon name={a.i} size={22} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--b-display)",
                  fontSize: 28,
                  fontWeight: 400,
                  margin: "0 0 12px",
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                }}
              >
                {a.t}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, opacity: a.bg === "#fff" ? 0.7 : 0.9, margin: 0 }}>
                {a.d}
              </p>
              <button
                style={{
                  marginTop: 28,
                  alignSelf: "flex-start",
                  padding: "11px 20px",
                  borderRadius: 999,
                  background: a.bg === "#fff" ? "var(--b-ink)" : "rgba(255,255,255,.15)",
                  color: a.bg === "#fff" ? "#fff" : a.color,
                  fontSize: 13,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  border: a.bg === "#fff" ? "none" : "1px solid rgba(255,255,255,.2)",
                }}
              >
                {a.cta} <Icon name="arrow-right" size={13} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Magazine editorial */}
      <section style={{ maxWidth: 1320, margin: "96px auto 0", padding: "0 32px" }}>
        <div
          style={{
            background: "var(--b-primary)",
            color: "var(--b-cream)",
            borderRadius: 28,
            padding: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 56 }}>
            <div
              style={{
                fontFamily: "var(--b-mono)",
                fontSize: 11,
                letterSpacing: 1.5,
                opacity: 0.7,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Magazín · Průvodce
            </div>
            <h2
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 48,
                margin: "16px 0 20px",
                fontWeight: 300,
                letterSpacing: -1.5,
                lineHeight: 1.05,
                fontVariationSettings: '"opsz" 144',
              }}
            >
              Pět otázek, které si položte{" "}
              <span style={{ fontStyle: "italic" }}>dřív,</span> než se pustíte do prohlídek.
            </h2>
            <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.6, margin: 0 }}>
              Praktický přehled toho, co prověřit u každé nemovitosti — od energetického štítku přes právní stav až po sousedství a infrastrukturu.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 12, alignItems: "center" }}>
              <button
                style={{
                  background: "var(--b-cream)",
                  color: "var(--b-primary-dark)",
                  padding: "13px 24px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Číst článek <Icon name="arrow-right" size={14} />
              </button>
              <span style={{ fontSize: 12, opacity: 0.7, fontFamily: "var(--b-mono)" }}>12 min čtení</span>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <PropPhoto seed={2} style={{ height: "100%" }} />
          </div>
        </div>
      </section>

      <B2Footer />
    </div>
  );
}
