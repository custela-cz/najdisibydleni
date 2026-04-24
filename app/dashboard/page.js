"use client";

import { BHeader } from "@/components/header";
import { Icon, PropPhoto, LISTINGS, bPage } from "@/components/shared";

export default function DashboardPage() {
  return (
    <div className="ab v-b" style={bPage}>
      <BHeader />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 32,
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
              Dobré ráno
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
              Kateřino, máte{" "}
              <em style={{ color: "var(--b-accent)", fontStyle: "italic" }}>5 nových zpráv.</em>
            </h1>
          </div>
          <div />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "flex-start" }}>
            <button
              style={{
                padding: "12px 20px",
                background: "#fff",
                border: "1px solid var(--b-line)",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Můj profil
            </button>
            <button
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
            </button>
          </div>
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
            { v: "3", l: "aktivních inzerátů" },
            { v: "2 847", l: "zobrazení / týden", d: "+18 %" },
            { v: "94", l: "uložení u kupců" },
            { v: "12 min", l: "průměrný čas strávený", d: "↑" },
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
              <div style={{ fontSize: 13, color: "var(--b-muted)", marginTop: 6 }}>
                {s.l} {s.d && <span style={{ color: "var(--b-accent)" }}>{s.d}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Listings */}
        <div style={{ marginTop: 40 }}>
          <h2
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 28,
              fontWeight: 400,
              margin: "0 0 20px",
            }}
          >
            Vaše inzeráty
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {LISTINGS.slice(0, 3).map((l) => (
              <div
                key={l.id}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid var(--b-line)",
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
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--b-accent)" }} />
                    Aktivní · publikováno před 5 dny
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
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 16,
                      fontSize: 12,
                      color: "var(--b-ink-2)",
                    }}
                  >
                    <span>
                      <strong style={{ fontSize: 18, fontFamily: "var(--b-display)", fontWeight: 500 }}>
                        {420 + l.id * 180}
                      </strong>{" "}
                      zobrazení
                    </span>
                    <span>
                      <strong style={{ fontSize: 18, fontFamily: "var(--b-display)", fontWeight: 500 }}>
                        {8 + l.id * 3}
                      </strong>{" "}
                      zpráv
                    </span>
                    <span>
                      <strong style={{ fontSize: 18, fontFamily: "var(--b-display)", fontWeight: 500 }}>
                        {18 + l.id * 4}
                      </strong>{" "}
                      ♥
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
