"use client";

export const PropPhoto = ({ seed = 1, className = "", style = {}, children, variant = "house" }) => {
  const palettes = [
    ["#B8C8D8", "#6B8199"],
    ["#D8CCB8", "#A39275"],
    ["#BFD4C4", "#7FA58C"],
    ["#C9B8C8", "#8E7D92"],
    ["#D4C4B4", "#9A846D"],
    ["#B8D0D8", "#739099"],
    ["#C4D0B8", "#8EA173"],
    ["#D0BDBD", "#9A7A7A"],
    ["#BDC6D0", "#6F7E94"],
    ["#D0C8BD", "#A39579"],
  ];
  const [a, b] = palettes[seed % palettes.length];
  return (
    <div
      className={`ph ${variant === "house" ? "ph-house" : ""} ${className}`}
      style={{ "--ph-a": a, "--ph-b": b, ...style }}
    >
      {children}
    </div>
  );
};

export const Icon = ({ name, size = 18, stroke = 1.6, style = {} }) => {
  const s = { width: size, height: size, ...style };
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "search":
      return <svg {...common} style={s}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "map":
      return <svg {...common} style={s}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14" /><path d="M15 6v14" /></svg>;
    case "pin":
      return <svg {...common} style={s}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>;
    case "bed":
      return <svg {...common} style={s}><path d="M2 17v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" /><path d="M2 20v-3h20v3" /><path d="M6 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" /></svg>;
    case "area":
      return <svg {...common} style={s}><path d="M3 9V3h6" /><path d="M21 9V3h-6" /><path d="M3 15v6h6" /><path d="M21 15v6h-6" /></svg>;
    case "heart":
      return <svg {...common} style={s}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" /></svg>;
    case "filter":
      return <svg {...common} style={s}><path d="M3 5h18" /><path d="M6 12h12" /><path d="M10 19h4" /></svg>;
    case "grid":
      return <svg {...common} style={s}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
    case "list":
      return <svg {...common} style={s}><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg>;
    case "user":
      return <svg {...common} style={s}><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>;
    case "plus":
      return <svg {...common} style={s}><path d="M12 5v14M5 12h14" /></svg>;
    case "check":
      return <svg {...common} style={s}><path d="m5 12 5 5 9-11" /></svg>;
    case "arrow-right":
      return <svg {...common} style={s}><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg>;
    case "chevron-down":
      return <svg {...common} style={s}><path d="m6 9 6 6 6-6" /></svg>;
    case "chevron-right":
      return <svg {...common} style={s}><path d="m9 6 6 6-6 6" /></svg>;
    case "chevron-left":
      return <svg {...common} style={s}><path d="m15 6-6 6 6 6" /></svg>;
    case "star":
      return <svg {...common} style={s}><path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3Z" /></svg>;
    case "home":
      return <svg {...common} style={s}><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10" /></svg>;
    case "building":
      return <svg {...common} style={s}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /><path d="M10 21v-4h4v4" /></svg>;
    case "camera":
      return <svg {...common} style={s}><path d="M4 8h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="4" /></svg>;
    case "sparkles":
      return <svg {...common} style={s}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>;
    case "bell":
      return <svg {...common} style={s}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case "eye":
      return <svg {...common} style={s}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "share":
      return <svg {...common} style={s}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.5 10.5 7-4M8.5 13.5l7 4" /></svg>;
    case "phone":
      return <svg {...common} style={s}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" /></svg>;
    case "upload":
      return <svg {...common} style={s}><path d="M12 4v12" /><path d="m7 9 5-5 5 5" /><path d="M4 20h16" /></svg>;
    case "logout":
      return <svg {...common} style={s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>;
    case "chart":
      return <svg {...common} style={s}><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 6-7" /></svg>;
    case "calendar":
      return <svg {...common} style={s}><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>;
    case "x":
      return <svg {...common} style={s}><path d="M6 6l12 12M6 18 18 6" /></svg>;
    case "menu":
      return <svg {...common} style={s}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "info":
      return <svg {...common} style={s}><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></svg>;
    case "edit":
      return <svg {...common} style={s}><path d="M4 20h4L20 8l-4-4L4 16v4Z" /></svg>;
    case "tree":
      return <svg {...common} style={s}><path d="M12 2a5 5 0 0 0-4 8 4 4 0 0 0 1 7h6a4 4 0 0 0 1-7 5 5 0 0 0-4-8Z" /><path d="M12 17v5" /></svg>;
    case "sun":
      return <svg {...common} style={s}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></svg>;
    case "wave":
      return <svg {...common} style={s}><path d="M3 12c3 0 3-3 6-3s3 3 6 3 3-3 6-3" /><path d="M3 18c3 0 3-3 6-3s3 3 6 3 3-3 6-3" /></svg>;
    default:
      return null;
  }
};

export const LISTINGS = [
  { id: 1, seed: 1, title: "Byt 3+kk s balkonem, Letná", place: "Praha 7 — Letná", price: "8 490 000 Kč", meta: "85 m² · 3+kk · 3. patro · Cihla", disp: "3+kk", area: 85, type: "Byt", status: "Nový", new: true },
  { id: 2, seed: 3, title: "Rodinný dům se zahradou", place: "Říčany u Prahy", price: "12 900 000 Kč", meta: "160 m² · 5+1 · pozemek 620 m²", disp: "5+1", area: 160, type: "Dům", status: "Doporučujeme" },
  { id: 3, seed: 2, title: "Podkrovní byt v činžovním domě", place: "Brno — Veveří", price: "5 690 000 Kč", meta: "62 m² · 2+kk · 4. patro · Cihla", disp: "2+kk", area: 62, type: "Byt" },
  { id: 4, seed: 6, title: "Loft v cihlové továrně", place: "Praha 8 — Karlín", price: "14 200 000 Kč", meta: "112 m² · 3+kk · 2. patro · Loft", disp: "3+kk", area: 112, type: "Byt", status: "Exkluzivně", new: true },
  { id: 5, seed: 4, title: "Chata u Slapské přehrady", place: "Slapy nad Vltavou", price: "3 450 000 Kč", meta: "60 m² · 2+1 · pozemek 380 m²", disp: "2+1", area: 60, type: "Chata" },
  { id: 6, seed: 8, title: "Novostavba 2+kk s terasou", place: "Praha 5 — Smíchov", price: "9 100 000 Kč", meta: "58 m² · 2+kk · novostavba · terasa 14 m²", disp: "2+kk", area: 58, type: "Byt", status: "Nový" },
  { id: 7, seed: 5, title: "Vila s bazénem v Modřanech", place: "Praha 4 — Modřany", price: "24 500 000 Kč", meta: "280 m² · 6+1 · bazén · sauna", disp: "6+1", area: 280, type: "Dům" },
  { id: 8, seed: 7, title: "Garsoniéra v centru", place: "Praha 1 — Staré Město", price: "4 290 000 Kč", meta: "28 m² · 1+kk · 2. patro", disp: "1+kk", area: 28, type: "Byt" },
  { id: 9, seed: 9, title: "Řadový dům s garáží", place: "Olomouc — Nové Sady", price: "7 800 000 Kč", meta: "140 m² · 4+1 · pozemek 220 m²", disp: "4+1", area: 140, type: "Dům" },
];

export const fmt = (n) => new Intl.NumberFormat("cs-CZ").format(n);

export const sellerBadge = {
  owner: { l: "Soukromý majitel", c: "var(--b-primary)", bg: "var(--b-primary-soft)" },
  agent: { l: "Ověřený makléř", c: "var(--b-accent)", bg: "var(--b-accent-soft)" },
  dev: { l: "Developer", c: "#876A2A", bg: "#F3EBD8" },
};

export const bInput = {
  width: "100%",
  padding: "12px 16px",
  background: "var(--b-bg)",
  border: "1px solid var(--b-line)",
  borderRadius: 12,
  fontSize: 15,
  outline: "none",
  fontFamily: "inherit",
};

export const bPage = {
  background: "var(--b-bg)",
  color: "var(--b-ink)",
  fontFamily: "var(--b-font)",
  fontSize: 15,
  minHeight: "100vh",
  fontFeatureSettings: '"ss01", "ss02", "cv11"',
};
