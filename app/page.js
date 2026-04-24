import Link from "next/link";
import { B2Header } from "@/components/header";
import { B2Footer } from "@/components/footer";
import { B2Card } from "@/components/cards";
import SearchBar from "@/components/search-bar";
import { Icon, PropPhoto, bPage } from "@/components/shared";
import { createClient } from "@/lib/supabase/server";
import { mapRowToListing } from "@/lib/supabase/shared";

export const revalidate = 30;

async function getLatest() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "aktivni")
    .order("created_at", { ascending: false })
    .limit(3);
  if (error) {
    console.error("supabase getLatest:", error.message);
    return [];
  }
  return (data || []).map(mapRowToListing);
}

const SELLER_KIND_BADGE = { owner: "owner", agent: "agent", dev: "dev" };

export default async function HomePage() {
  const latest = await getLatest();

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
              Soukromí prodejci, realitní makléři i developeři na jednom místě. Vložte inzerát zdarma bez registrace.
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
                {latest[0]?.title || "Rodinný dům, Říčany"}
              </div>
              <div style={{ fontSize: 13, color: "var(--b-muted)", marginTop: 2 }}>
                {latest[0] ? `${latest[0].area} m² · ${latest[0].disp}` : "160 m² · 5+1 · zahrada 620 m²"}
              </div>
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
                  {latest[0]?.price || "12,9 mil. Kč"}
                </div>
                <Link
                  href={latest[0] ? `/inzerat/${latest[0].id}` : "/koupit"}
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
        <div style={{ marginTop: 64 }}>
          <SearchBar />
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
            { i: "building", l: "Byty", c: "byt", seed: 0 },
            { i: "home", l: "Rodinné domy", c: "dum", seed: 1 },
            { i: "tree", l: "Pozemky", c: "pozemek", seed: 2 },
            { i: "sun", l: "Chaty & chalupy", c: "chata", seed: 3 },
            { i: "building", l: "Novostavby", c: "novostavba", seed: 5 },
            { i: "wave", l: "Komerční", c: "komercni", seed: 6 },
          ].map((c) => (
            <Link
              key={c.l}
              href={`/koupit?ptype=${c.c}`}
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
          <Link
            href="/koupit"
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              background: "var(--b-ink)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Všechny nabídky <Icon name="arrow-right" size={13} />
          </Link>
        </div>
        {latest.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {latest.map((l) => (
              <B2Card key={l.id} l={l} seller={SELLER_KIND_BADGE[l.seller_kind] || "owner"} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 36,
              background: "#fff",
              border: "1px dashed var(--b-line)",
              borderRadius: 16,
              textAlign: "center",
              color: "var(--b-muted)",
            }}
          >
            Zatím žádné nabídky — buďte první a{" "}
            <Link href="/vlozit" style={{ color: "var(--b-accent)", fontWeight: 500 }}>
              vložte inzerát
            </Link>
            .
          </div>
        )}
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
              href: "/koupit",
              bg: "#fff",
              color: "var(--b-ink)",
            },
            {
              i: "home",
              t: "Prodávám soukromě",
              d: "Wizard s AI popisem, doporučená cena podle tržních dat, celý průběh online. Bez zbytečných kroků.",
              cta: "Vložit inzerát",
              href: "/vlozit",
              bg: "var(--b-primary)",
              color: "var(--b-cream)",
            },
            {
              i: "building",
              t: "Jsem makléř či RK",
              d: "Profesionální účet, hromadný import, CRM integrace, analytika a topování. Férové ceny.",
              cta: "Profesionální účet",
              href: "/dashboard",
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
              <Link
                href={a.href}
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
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Magazine editorial */}
      <section
        id="magazin"
        style={{ maxWidth: 1320, margin: "96px auto 0", padding: "0 32px", scrollMarginTop: 96 }}
      >
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
              <span style={{ fontSize: 12, opacity: 0.7, fontFamily: "var(--b-mono)" }}>připravujeme</span>
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
