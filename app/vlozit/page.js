"use client";

import { BHeader } from "@/components/header";
import { Icon, bPage, bInput } from "@/components/shared";

const BField = ({ label, children }) => (
  <label>
    <div
      style={{
        fontSize: 12,
        color: "var(--b-muted)",
        fontWeight: 500,
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    {children}
  </label>
);

export default function WizardPage() {
  return (
    <div className="ab v-b" style={bPage}>
      <BHeader />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: n <= 3 ? "var(--b-primary)" : "var(--b-line)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--b-accent)",
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Krok 3 ze 6 · Parametry
        </div>
        <h1
          style={{
            fontFamily: "var(--b-display)",
            fontSize: 48,
            margin: "12px 0 12px",
            fontWeight: 400,
            letterSpacing: -1,
            lineHeight: 1.05,
          }}
        >
          Povězte nám víc o{" "}
          <em style={{ color: "var(--b-accent)", fontStyle: "italic", fontWeight: 300 }}>vašem</em>{" "}
          bydlení.
        </h1>
        <p style={{ fontSize: 16, color: "var(--b-ink-2)", margin: "0 0 40px", lineHeight: 1.5 }}>
          Pár základních údajů a je hotovo. Popis zvládne napsat naše AI — vy ho pak jen doladíte.
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 36,
            border: "1px solid var(--b-line)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <BField label="Dispozice">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["1+kk", "2+kk", "3+kk", "3+1", "4+1"].map((d) => (
                  <button
                    key={d}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 999,
                      fontSize: 14,
                      fontWeight: 500,
                      background: d === "3+kk" ? "var(--b-primary)" : "#fff",
                      color: d === "3+kk" ? "var(--b-cream)" : "var(--b-ink)",
                      border: "1px solid " + (d === "3+kk" ? "var(--b-primary)" : "var(--b-line)"),
                    }}
                  >
                    {d}
                  </button>
                ))}
                <button
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    fontSize: 13,
                    color: "var(--b-muted)",
                    fontWeight: 500,
                  }}
                >
                  další…
                </button>
              </div>
            </BField>
            <BField label="Plocha (m²)">
              <input defaultValue="85" style={bInput} />
            </BField>
            <BField label="Patro / z celkem">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input defaultValue="3" style={bInput} />
                <input defaultValue="5" style={bInput} />
              </div>
            </BField>
            <BField label="Stav nemovitosti">
              <select defaultValue="Po rekonstrukci" style={bInput}>
                <option>Novostavba</option>
                <option>Po rekonstrukci</option>
                <option>Velmi dobrý</option>
                <option>Dobrý</option>
              </select>
            </BField>
          </div>

          <div style={{ marginTop: 32 }}>
            <BField label="Napište pár vět o nemovitosti">
              <div style={{ position: "relative" }}>
                <textarea
                  rows={5}
                  placeholder="Pár vět o tom, co se vám na nemovitosti líbí — zbytek dořeším ✨"
                  style={{ ...bInput, resize: "vertical", lineHeight: 1.5 }}
                />
                <button
                  style={{
                    position: "absolute",
                    right: 12,
                    bottom: 12,
                    padding: "8px 14px",
                    background: "var(--b-accent)",
                    color: "#fff",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon name="sparkles" size={13} /> Napsat za mě
                </button>
              </div>
            </BField>
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              background: "transparent",
              color: "var(--b-ink-2)",
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="chevron-left" size={14} /> Zpět
          </button>
          <div style={{ fontSize: 13, color: "var(--b-muted)" }}>Automaticky ukládáme</div>
          <button
            style={{
              padding: "12px 28px",
              background: "var(--b-primary)",
              color: "var(--b-cream)",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Pokračovat na fotky <Icon name="arrow-right" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
