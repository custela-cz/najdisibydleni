"use client";

import Link from "next/link";
import { Icon, PropPhoto, fmt, sellerBadge } from "./shared";

export const B2Card = ({ l, seller = "owner" }) => {
  const s = sellerBadge[seller];
  return (
    <article
      style={{
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid var(--b-line)",
      }}
    >
      <div style={{ position: "relative", padding: 10 }}>
        <PropPhoto seed={l.seed} style={{ aspectRatio: "4/3", borderRadius: 16 }} />
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "rgba(255,255,255,.95)",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "var(--b-mono)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: s.c,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 999, background: s.c }} />
          {s.l}
        </div>
        <button
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            background: "#fff",
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name="heart" size={14} />
        </button>
      </div>
      <div style={{ padding: "8px 22px 22px" }}>
        <div style={{ fontSize: 12, color: "var(--b-muted)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="pin" size={11} /> {l.place}
        </div>
        <h3
          style={{
            fontFamily: "var(--b-display)",
            fontSize: 24,
            fontWeight: 400,
            margin: "6px 0 8px",
            letterSpacing: -0.5,
            lineHeight: 1.1,
          }}
        >
          {l.title}
        </h3>
        <div style={{ fontSize: 13, color: "var(--b-ink-2)", display: "flex", gap: 14 }}>
          <span>{l.area} m²</span>·<span>{l.disp}</span>·<span>cihla</span>
        </div>
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid var(--b-line-2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 24,
              fontWeight: 400,
              color: "var(--b-primary)",
              letterSpacing: -0.5,
            }}
          >
            {l.price}
          </div>
          <Link
            href={`/inzerat/${l.id}`}
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              background: "var(--b-cream)",
              color: "var(--b-primary)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export const B2MapRow = ({ l, active, seller = "agent" }) => {
  const s = sellerBadge[seller];
  return (
    <article
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 10,
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: 16,
        border: active ? "2px solid var(--b-primary)" : "1px solid var(--b-line)",
        boxShadow: active ? "var(--b-shadow)" : "none",
      }}
    >
      <div style={{ position: "relative" }}>
        <PropPhoto seed={l.seed} style={{ aspectRatio: "4/3", borderRadius: 14 }} />
        <button
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            background: "#fff",
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name="heart" size={13} />
        </button>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            background: "rgba(23,24,27,.7)",
            color: "#fff",
            padding: "3px 8px",
            borderRadius: 999,
            fontSize: 11,
            fontFamily: "var(--b-mono)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon name="camera" size={11} /> {8 + (l.id * 3) % 16}
        </div>
      </div>
      <div style={{ padding: "8px 12px 8px 0", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: 6,
            padding: "3px 10px",
            background: s.bg,
            color: s.c,
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "var(--b-mono)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 999, background: s.c }} />
          {s.l}
        </div>
        <h3
          style={{
            fontFamily: "var(--b-display)",
            fontSize: 22,
            fontWeight: 400,
            margin: "8px 0 4px",
            letterSpacing: -0.5,
            lineHeight: 1.1,
          }}
        >
          {l.title}
        </h3>
        <div style={{ fontSize: 13, color: "var(--b-muted)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="pin" size={12} /> {l.place}
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 14, fontSize: 13, color: "var(--b-ink-2)" }}>
          <span>
            <Icon name="area" size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
            {l.area} m²
          </span>
          <span>
            <Icon name="bed" size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
            {l.disp}
          </span>
          <span style={{ color: "var(--b-muted)" }}>· cihla, 3. patro</span>
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 24,
                fontWeight: 400,
                color: "var(--b-primary)",
                letterSpacing: -0.5,
                lineHeight: 1,
              }}
            >
              {l.price}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--b-muted)",
                fontFamily: "var(--b-mono)",
                marginTop: 3,
              }}
            >
              {fmt(Math.round(parseInt(l.price.replace(/\D/g, "")) / l.area))} Kč/m²
            </div>
          </div>
          <Link
            href={`/inzerat/${l.id}`}
            style={{
              padding: "9px 16px",
              background: "var(--b-ink)",
              color: "#fff",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Detail <Icon name="arrow-right" size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export const B2SearchCell = ({ label, value, muted }) => (
  <div style={{ padding: "14px 22px", borderRight: "1px solid var(--b-line-2)" }}>
    <div
      style={{
        fontFamily: "var(--b-mono)",
        fontSize: 10,
        color: "var(--b-muted)",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 15,
        fontWeight: 500,
        marginTop: 4,
        color: muted ? "var(--b-muted)" : "var(--b-ink)",
      }}
    >
      {value}
    </div>
  </div>
);
