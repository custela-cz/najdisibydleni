"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./shared";

export const SEARCH_TYPES = [
  { v: "byt-koupe", l: "Byt ke koupi" },
  { v: "dum-koupe", l: "Dům ke koupi" },
  { v: "pozemek-koupe", l: "Pozemek ke koupi" },
  { v: "chata-koupe", l: "Chata / chalupa" },
  { v: "novostavba", l: "Novostavba" },
  { v: "komercni-koupe", l: "Komerční nemovitost" },
  { v: "byt-najem", l: "Byt k pronájmu" },
  { v: "dum-najem", l: "Dům k pronájmu" },
];

export const PRICE_PRESETS_BUY = [
  { v: "", l: "Bez limitu" },
  { v: "0-3000000", l: "do 3 mil. Kč" },
  { v: "0-5000000", l: "do 5 mil. Kč" },
  { v: "0-8000000", l: "do 8 mil. Kč" },
  { v: "0-10000000", l: "do 10 mil. Kč" },
  { v: "0-15000000", l: "do 15 mil. Kč" },
  { v: "0-20000000", l: "do 20 mil. Kč" },
  { v: "20000000-", l: "nad 20 mil. Kč" },
];

export const PRICE_PRESETS_RENT = [
  { v: "", l: "Bez limitu" },
  { v: "0-10000", l: "do 10 000 Kč" },
  { v: "0-15000", l: "do 15 000 Kč" },
  { v: "0-20000", l: "do 20 000 Kč" },
  { v: "0-30000", l: "do 30 000 Kč" },
  { v: "0-50000", l: "do 50 000 Kč" },
  { v: "50000-", l: "nad 50 000 Kč" },
];

export const DISPOSITIONS = ["1+kk", "1+1", "2+kk", "2+1", "3+kk", "3+1", "4+kk", "4+1", "5+kk", "5+1", "6 a více"];

export const CITIES = [
  "Praha",
  "Praha 1 — Staré Město", "Praha 2 — Vinohrady", "Praha 2 — Nusle", "Praha 3 — Žižkov",
  "Praha 4 — Nusle", "Praha 4 — Modřany", "Praha 4 — Podolí", "Praha 5 — Smíchov",
  "Praha 5 — Košíře", "Praha 6 — Dejvice", "Praha 6 — Břevnov", "Praha 7 — Letná",
  "Praha 7 — Holešovice", "Praha 8 — Karlín", "Praha 8 — Libeň", "Praha 9 — Vysočany",
  "Praha 10 — Vršovice", "Praha 10 — Strašnice",
  "Brno", "Brno — Veveří", "Brno — Královo Pole", "Brno — Žabovřesky", "Brno — Černá Pole",
  "Ostrava", "Ostrava — Poruba", "Ostrava — Mariánské Hory",
  "Plzeň", "Plzeň — Bory", "Plzeň — Doubravka",
  "Liberec", "Olomouc", "Olomouc — Nové Sady", "České Budějovice", "Hradec Králové",
  "Ústí nad Labem", "Pardubice", "Zlín", "Havířov", "Kladno", "Most", "Karviná",
  "Opava", "Jihlava", "Teplice", "Děčín", "Karlovy Vary", "Chomutov", "Jablonec nad Nisou",
  "Mladá Boleslav", "Prostějov", "Přerov", "Česká Lípa", "Třebíč", "Třinec",
  "Tábor", "Znojmo", "Příbram", "Cheb", "Orlová", "Kolín", "Trutnov", "Písek", "Kroměříž",
  "Šumperk", "Vsetín", "Valašské Meziříčí", "Litvínov", "Nový Jičín", "Hodonín",
  "Říčany u Prahy", "Kostelec nad Černými lesy", "Kutná Hora", "Slapy nad Vltavou",
];

const PRICE_PANEL_BY_TYPE = (type) => (type.endsWith("-najem") ? PRICE_PRESETS_RENT : PRICE_PRESETS_BUY);

const panelStyle = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  background: "#fff",
  border: "1px solid var(--b-line)",
  borderRadius: 14,
  boxShadow: "0 18px 40px -12px rgba(23,24,27,.22), 0 4px 10px rgba(23,24,27,.06)",
  zIndex: 30,
  padding: 8,
  minWidth: 260,
  maxHeight: 340,
  overflowY: "auto",
};

const itemStyle = (active) => ({
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 14,
  fontWeight: active ? 600 : 500,
  background: active ? "var(--b-cream)" : "transparent",
  color: active ? "var(--b-primary)" : "var(--b-ink)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
});

function Cell({ label, children, last }) {
  return (
    <div
      style={{
        position: "relative",
        padding: "14px 22px",
        borderRight: last ? "none" : "1px solid var(--b-line-2)",
        minWidth: 0,
      }}
    >
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
      {children}
    </div>
  );
}

function ValueButton({ onClick, value, muted, placeholder }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        width: "100%",
        marginTop: 4,
        fontSize: 15,
        fontWeight: 500,
        color: muted ? "var(--b-muted)" : "var(--b-ink)",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          minWidth: 0,
        }}
      >
        {value || placeholder}
      </span>
      <Icon name="chevron-down" size={14} style={{ color: "var(--b-muted)", flexShrink: 0 }} />
    </button>
  );
}

export default function SearchBar({ initial = {}, variant = "home" }) {
  const router = useRouter();

  const [type, setType] = useState(initial.type || "byt-koupe");
  const [where, setWhere] = useState(initial.where || "");
  const [whereInput, setWhereInput] = useState(initial.where || "");
  const [price, setPrice] = useState(initial.price || "");
  const [disp, setDisp] = useState(initial.disp ? initial.disp.split(",").filter(Boolean) : []);
  const [open, setOpen] = useState(null);

  const rootRef = useRef(null);
  const whereInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(null);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open === "where") {
      setTimeout(() => whereInputRef.current?.focus(), 10);
    }
  }, [open]);

  const typeLabel = SEARCH_TYPES.find((x) => x.v === type)?.l || SEARCH_TYPES[0].l;
  const priceOptions = useMemo(() => PRICE_PANEL_BY_TYPE(type), [type]);
  const priceLabel = priceOptions.find((x) => x.v === price)?.l || "Bez limitu";
  const dispLabel = disp.length === 0 ? "Jakákoli" : disp.length <= 3 ? disp.join(", ") : `${disp.length} vybraných`;

  const citySuggestions = useMemo(() => {
    const q = whereInput.trim().toLowerCase();
    if (!q) return CITIES.slice(0, 14);
    const fold = (s) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
    const qf = fold(q);
    return CITIES.filter((c) => fold(c).includes(qf)).slice(0, 14);
  }, [whereInput]);

  const submit = () => {
    const params = new URLSearchParams();
    params.set("type", type);
    if (where) params.set("where", where);
    if (price) params.set("price", price);
    if (disp.length) params.set("disp", disp.join(","));
    router.push(`/koupit?${params.toString()}`);
  };

  const toggleDisp = (d) =>
    setDisp((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const pickWhere = (c) => {
    setWhere(c);
    setWhereInput(c);
    setOpen(null);
  };

  const clearWhere = (e) => {
    e.stopPropagation();
    setWhere("");
    setWhereInput("");
    setOpen(null);
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: "relative",
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
        {/* Hledám */}
        <Cell label="Hledám">
          <ValueButton onClick={() => setOpen(open === "type" ? null : "type")} value={typeLabel} />
          {open === "type" && (
            <div style={panelStyle}>
              {SEARCH_TYPES.map((t) => (
                <div
                  key={t.v}
                  style={itemStyle(t.v === type)}
                  onClick={() => {
                    setType(t.v);
                    if (price && !PRICE_PANEL_BY_TYPE(t.v).some((p) => p.v === price)) setPrice("");
                    setOpen(null);
                  }}
                >
                  {t.v === type && <Icon name="check" size={14} />}
                  <span style={{ flex: 1 }}>{t.l}</span>
                </div>
              ))}
            </div>
          )}
        </Cell>

        {/* Kde */}
        <Cell label="Kde">
          <div
            onClick={() => setOpen("where")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
              cursor: "text",
            }}
          >
            <input
              ref={whereInputRef}
              value={open === "where" ? whereInput : where || whereInput}
              onChange={(e) => {
                setWhereInput(e.target.value);
                setOpen("where");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (citySuggestions[0]) pickWhere(citySuggestions[0]);
                }
              }}
              placeholder="Praha, Brno, PSČ…"
              style={{
                flex: 1,
                minWidth: 0,
                border: 0,
                outline: 0,
                background: "transparent",
                padding: 0,
                fontSize: 15,
                fontWeight: 500,
                color: where || whereInput ? "var(--b-ink)" : "var(--b-muted)",
                fontFamily: "inherit",
              }}
            />
            {(where || whereInput) ? (
              <button onClick={clearWhere} style={{ color: "var(--b-muted)", padding: 0 }}>
                <Icon name="x" size={14} />
              </button>
            ) : (
              <Icon name="chevron-down" size={14} style={{ color: "var(--b-muted)" }} />
            )}
          </div>
          {open === "where" && (
            <div style={panelStyle}>
              {citySuggestions.length === 0 && (
                <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--b-muted)" }}>
                  Žádné lokality neodpovídají.
                </div>
              )}
              {citySuggestions.map((c) => (
                <div
                  key={c}
                  style={itemStyle(c === where)}
                  onClick={() => pickWhere(c)}
                >
                  <Icon name="pin" size={13} style={{ color: "var(--b-muted)" }} />
                  <span style={{ flex: 1 }}>{c}</span>
                </div>
              ))}
            </div>
          )}
        </Cell>

        {/* Cena */}
        <Cell label="Cena">
          <ValueButton onClick={() => setOpen(open === "price" ? null : "price")} value={priceLabel} />
          {open === "price" && (
            <div style={panelStyle}>
              {priceOptions.map((p) => (
                <div
                  key={p.v || "none"}
                  style={itemStyle(p.v === price)}
                  onClick={() => {
                    setPrice(p.v);
                    setOpen(null);
                  }}
                >
                  {p.v === price && <Icon name="check" size={14} />}
                  <span style={{ flex: 1 }}>{p.l}</span>
                </div>
              ))}
            </div>
          )}
        </Cell>

        {/* Dispozice */}
        <Cell label="Dispozice">
          <ValueButton onClick={() => setOpen(open === "disp" ? null : "disp")} value={dispLabel} />
          {open === "disp" && (
            <div style={{ ...panelStyle, minWidth: 300 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {DISPOSITIONS.map((d) => {
                  const active = disp.includes(d);
                  return (
                    <div
                      key={d}
                      onClick={() => toggleDisp(d)}
                      style={{
                        ...itemStyle(active),
                        justifyContent: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          border: `1.5px solid ${active ? "var(--b-primary)" : "var(--b-line)"}`,
                          background: active ? "var(--b-primary)" : "#fff",
                          display: "grid",
                          placeItems: "center",
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {active && <Icon name="check" size={10} stroke={2.5} />}
                      </span>
                      <span>{d}</span>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 8,
                  marginTop: 6,
                  borderTop: "1px solid var(--b-line-2)",
                }}
              >
                <button
                  onClick={() => setDisp([])}
                  style={{ fontSize: 13, color: "var(--b-muted)", padding: "6px 10px" }}
                >
                  Vymazat
                </button>
                <button
                  onClick={() => setOpen(null)}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--b-primary)",
                    padding: "6px 10px",
                  }}
                >
                  Hotovo
                </button>
              </div>
            </div>
          )}
        </Cell>

        {/* Hledat */}
        <button
          onClick={submit}
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
            cursor: "pointer",
          }}
        >
          <Icon name="search" size={17} /> Hledat
        </button>
      </div>
    </div>
  );
}
