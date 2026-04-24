"use client";

import Link from "next/link";
import { PropPhoto, bPage, bInput } from "@/components/shared";

export default function LoginPage() {
  return (
    <div
      className="ab v-b"
      style={{ ...bPage, display: "grid", gridTemplateColumns: "1fr 1.2fr", minHeight: "100vh" }}
    >
      <div style={{ display: "grid", placeItems: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <path d="M4 14 L14 4 L24 14 L24 24 L4 24 Z" fill="none" stroke="var(--b-primary)" strokeWidth="1.5" />
              <circle cx="14" cy="18" r="2" fill="var(--b-accent)" />
            </svg>
            <div style={{ fontFamily: "var(--b-display)", fontSize: 20, fontStyle: "italic" }}>
              najdisibydlení
            </div>
          </Link>
          <h1
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 44,
              fontWeight: 400,
              margin: "0 0 12px",
              letterSpacing: -1,
              lineHeight: 1,
            }}
          >
            Vítejte<br />
            <em style={{ color: "var(--b-accent)", fontStyle: "italic", fontWeight: 300 }}>zpátky.</em>
          </h1>
          <p style={{ color: "var(--b-muted)", fontSize: 15, margin: "0 0 32px" }}>
            Přihlaste se a pokračujte v hledání svého domova.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input placeholder="E-mail" style={bInput} />
            <input placeholder="Heslo" type="password" style={bInput} />
            <button
              style={{
                padding: 14,
                background: "var(--b-primary)",
                color: "var(--b-cream)",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Přihlásit se →
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--b-line)" }} />
              <span style={{ fontSize: 12, color: "var(--b-muted)" }}>nebo</span>
              <div style={{ flex: 1, height: 1, background: "var(--b-line)" }} />
            </div>
            <button
              style={{
                padding: 12,
                background: "#fff",
                border: "1px solid var(--b-line)",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              Přihlásit přes Bankovní ID
            </button>
          </div>
          <div style={{ marginTop: 32, fontSize: 13, color: "var(--b-muted)", textAlign: "center" }}>
            Nový zde?{" "}
            <a style={{ color: "var(--b-accent)", fontWeight: 500, cursor: "pointer" }}>Založte si účet</a>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", padding: 24 }}>
        <PropPhoto seed={2} style={{ width: "100%", height: "100%", borderRadius: 24 }} />
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 48,
            right: 48,
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,.3)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 36,
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.1,
              letterSpacing: -0.5,
            }}
          >
            „Našli jsme tady dům, o kterém jsme si mysleli, že už neexistuje.&ldquo;
          </div>
          <div style={{ marginTop: 16, fontSize: 13, opacity: 0.9 }}>— Jana a Pavel, nyní doma v Kostelci</div>
        </div>
      </div>
    </div>
  );
}
