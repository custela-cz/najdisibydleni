import Link from "next/link";
import { BHeader } from "@/components/header";
import { Icon, PropPhoto, bPage } from "@/components/shared";
import { createClient } from "@/lib/supabase/server";
import { mapRowToListing } from "@/lib/supabase/shared";

export const revalidate = 30;

async function fetchOverview() {
  const supabase = await createClient();
  const [all, recent] = await Promise.all([
    supabase.from("properties").select("id,offer_type,property_type,price", { count: "exact" }).eq("status", "aktivni"),
    supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(6),
  ]);
  const active = all.count ?? 0;
  const rows = recent.data || [];
  const forSale = (all.data || []).filter((r) => r.offer_type === "prodej").length;
  const forRent = (all.data || []).filter((r) => r.offer_type === "pronajem").length;
  const avgPrice = (() => {
    const sale = (all.data || []).filter((r) => r.offer_type === "prodej");
    if (sale.length === 0) return null;
    const sum = sale.reduce((s, r) => s + (r.price || 0), 0);
    return Math.round(sum / sale.length);
  })();
  return {
    active,
    forSale,
    forRent,
    avgPrice,
    recent: rows.map(mapRowToListing),
  };
}

export default async function DashboardPage() {
  const { active, forSale, forRent, avgPrice, recent } = await fetchOverview();

  return (
    <div className="ab v-b" style={bPage}>
      <BHeader />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 16,
            marginBottom: 32,
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--b-accent)",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Přehled portálu
            </div>
            <h1
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 40,
                margin: "8px 0 0",
                fontWeight: 400,
                letterSpacing: -0.5,
              }}
            >
              Aktuálně <em style={{ color: "var(--b-accent)", fontStyle: "italic" }}>{active} inzerátů</em> v&nbsp;databázi.
            </h1>
          </div>
          <Link
            href="/vlozit"
            style={{
              padding: "12px 20px",
              background: "var(--b-ink)",
              color: "#fff",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="plus" size={14} /> Nový inzerát
          </Link>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            paddingBottom: 32,
            borderBottom: "1px solid var(--b-line-2)",
          }}
        >
          {[
            { v: String(active), l: "aktivních inzerátů" },
            { v: String(forSale), l: "k prodeji" },
            { v: String(forRent), l: "k pronájmu" },
            {
              v: avgPrice
                ? `${(avgPrice / 1_000_000).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} mil.`
                : "—",
              l: "průměrná cena prodeje",
            },
          ].map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontFamily: "var(--b-display)",
                  fontSize: 52,
                  fontWeight: 400,
                  letterSpacing: -2,
                  lineHeight: 1,
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: 13, color: "var(--b-muted)", marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Recent listings */}
        <div style={{ marginTop: 40 }}>
          <h2
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 28,
              fontWeight: 400,
              margin: "0 0 20px",
            }}
          >
            Nedávno přidané inzeráty
          </h2>
          {recent.length === 0 ? (
            <div
              style={{
                padding: 32,
                background: "#fff",
                borderRadius: 16,
                border: "1px dashed var(--b-line)",
                textAlign: "center",
                color: "var(--b-muted)",
              }}
            >
              Zatím žádné inzeráty.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {recent.map((l) => (
                <Link
                  key={l.id}
                  href={`/inzerat/${l.id}`}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid var(--b-line)",
                    display: "block",
                  }}
                >
                  <div style={{ padding: 8 }}>
                    <PropPhoto seed={l.seed} style={{ aspectRatio: "16/10", borderRadius: 14 }} />
                  </div>
                  <div style={{ padding: "4px 20px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        color: "var(--b-accent)",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{ width: 8, height: 8, borderRadius: 999, background: "var(--b-accent)" }}
                      />
                      Aktivní
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--b-display)",
                        fontSize: 20,
                        fontWeight: 500,
                        margin: "8px 0 4px",
                      }}
                    >
                      {l.title}
                    </h3>
                    <div style={{ fontSize: 13, color: "var(--b-muted)" }}>{l.place}</div>
                    <div
                      style={{
                        marginTop: 12,
                        fontFamily: "var(--b-display)",
                        fontSize: 20,
                        fontWeight: 500,
                        color: "var(--b-primary)",
                      }}
                    >
                      {l.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
