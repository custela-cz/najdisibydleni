"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BHeader } from "@/components/header";
import { Icon, PropPhoto, bPage, bInput } from "@/components/shared";
import { supabase, buildTitle } from "@/lib/supabase";
import { CITIES, DISPOSITIONS } from "@/components/search-bar";

const STEPS = [
  { k: 1, l: "Typ" },
  { k: 2, l: "Lokalita" },
  { k: 3, l: "Parametry" },
  { k: 4, l: "Fotky" },
  { k: 5, l: "Cena" },
  { k: 6, l: "Publikace" },
];

const PROPERTY_TYPES = [
  { v: "byt", l: "Byt", i: "building" },
  { v: "dum", l: "Dům", i: "home" },
  { v: "pozemek", l: "Pozemek", i: "tree" },
  { v: "chata", l: "Chata / chalupa", i: "sun" },
  { v: "novostavba", l: "Novostavba", i: "building" },
  { v: "komercni", l: "Komerční", i: "wave" },
];

const CONDITIONS = ["Novostavba", "Po rekonstrukci", "Velmi dobrý", "Dobrý", "Před rekonstrukcí"];
const ENERGY = ["A", "B", "C", "D", "E", "F", "G"];
const SELLER_KINDS = [
  { v: "owner", l: "Soukromý majitel" },
  { v: "agent", l: "Realitní makléř" },
  { v: "dev", l: "Developer" },
];

const Field = ({ label, children, hint }) => (
  <label style={{ display: "block" }}>
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
    {hint && (
      <div style={{ fontSize: 12, color: "var(--b-muted)", marginTop: 6 }}>{hint}</div>
    )}
  </label>
);

const Pill = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "10px 16px",
      borderRadius: 999,
      fontSize: 14,
      fontWeight: 500,
      background: active ? "var(--b-primary)" : "#fff",
      color: active ? "var(--b-cream)" : "var(--b-ink)",
      border: "1px solid " + (active ? "var(--b-primary)" : "var(--b-line)"),
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

export default function WizardPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    offer_type: "prodej",
    property_type: "byt",
    city: "",
    district: "",
    street: "",
    zip_code: "",
    disposition: "3+kk",
    area: "",
    floor: "",
    total_floors: "",
    condition_note: "Po rekonstrukci",
    energy_class: "",
    has_balcony: false,
    has_parking: false,
    has_garden: false,
    has_elevator: false,
    price: "",
    description: "",
    seller_name: "",
    seller_email: "",
    seller_phone: "",
    seller_kind: "owner",
  });

  const [whereQuery, setWhereQuery] = useState("");
  const [whereOpen, setWhereOpen] = useState(false);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const canContinue = () => {
    if (step === 1) return !!form.property_type && !!form.offer_type;
    if (step === 2) return !!form.city;
    if (step === 3) return !!form.area;
    if (step === 4) return true;
    if (step === 5) return !!form.price;
    if (step === 6) return !!form.seller_name && !!form.seller_email;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const title = buildTitle({
      property_type: form.property_type,
      disposition: form.disposition,
      city: form.city,
      district: form.district,
    });
    const payload = {
      title,
      description: form.description,
      offer_type: form.offer_type,
      property_type: form.property_type,
      price: parseInt(form.price, 10),
      area: parseInt(form.area, 10),
      disposition: form.disposition || null,
      city: form.city,
      district: form.district || null,
      street: form.street || null,
      zip_code: form.zip_code || null,
      floor: form.floor ? parseInt(form.floor, 10) : null,
      total_floors: form.total_floors ? parseInt(form.total_floors, 10) : null,
      condition_note: form.condition_note || null,
      energy_class: form.energy_class || null,
      has_balcony: form.has_balcony,
      has_parking: form.has_parking,
      has_garden: form.has_garden,
      has_elevator: form.has_elevator,
      seller_name: form.seller_name,
      seller_email: form.seller_email,
      seller_phone: form.seller_phone || null,
      seller_kind: form.seller_kind,
      seed_index: Math.floor(Math.random() * 10),
    };
    const { data, error } = await supabase
      .from("properties")
      .insert(payload)
      .select("id")
      .single();
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(`/inzerat/${data.id}?nove=1`);
  };

  const citySuggestions = (() => {
    const q = whereQuery.trim().toLowerCase();
    if (!q) return CITIES.slice(0, 10);
    const fold = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return CITIES.filter((c) => fold(c).includes(fold(q))).slice(0, 10);
  })();

  return (
    <div className="ab v-b" style={bPage}>
      <BHeader />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {STEPS.map((s) => (
            <div
              key={s.k}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: s.k <= step ? "var(--b-primary)" : "var(--b-line)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            fontSize: 11,
            fontFamily: "var(--b-mono)",
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "var(--b-muted)",
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.k}
              style={{
                flex: 1,
                textAlign: "center",
                color: s.k === step ? "var(--b-accent)" : s.k < step ? "var(--b-ink-2)" : "var(--b-muted)",
                fontWeight: s.k === step ? 600 : 500,
              }}
            >
              {s.k}. {s.l}
            </div>
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
          Krok {step} ze 6 · {STEPS[step - 1].l}
        </div>

        {step === 1 && (
          <>
            <h1
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 42,
                margin: "12px 0 12px",
                fontWeight: 400,
                letterSpacing: -1,
                lineHeight: 1.05,
              }}
            >
              Co chcete <em style={{ color: "var(--b-accent)", fontStyle: "italic" }}>nabídnout</em>?
            </h1>
            <p style={{ fontSize: 16, color: "var(--b-ink-2)", margin: "0 0 28px" }}>
              Vyberte typ nemovitosti a jestli ji chcete prodat nebo pronajmout.
            </p>
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                border: "1px solid var(--b-line)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <Field label="Záměr">
                <div style={{ display: "flex", gap: 10 }}>
                  <Pill
                    active={form.offer_type === "prodej"}
                    onClick={() => update("offer_type", "prodej")}
                  >
                    Prodej
                  </Pill>
                  <Pill
                    active={form.offer_type === "pronajem"}
                    onClick={() => update("offer_type", "pronajem")}
                  >
                    Pronájem
                  </Pill>
                </div>
              </Field>
              <Field label="Typ nemovitosti">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {PROPERTY_TYPES.map((t) => {
                    const active = form.property_type === t.v;
                    return (
                      <button
                        type="button"
                        key={t.v}
                        onClick={() => update("property_type", t.v)}
                        style={{
                          padding: "18px 16px",
                          borderRadius: 14,
                          border: "1px solid " + (active ? "var(--b-primary)" : "var(--b-line)"),
                          background: active ? "var(--b-primary-soft)" : "#fff",
                          color: active ? "var(--b-primary)" : "var(--b-ink)",
                          fontSize: 14,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          cursor: "pointer",
                        }}
                      >
                        <Icon name={t.i} size={20} />
                        <span>{t.l}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 42,
                margin: "12px 0 12px",
                fontWeight: 400,
                letterSpacing: -1,
                lineHeight: 1.05,
              }}
            >
              Kde se <em style={{ color: "var(--b-accent)", fontStyle: "italic" }}>nachází</em>?
            </h1>
            <p style={{ fontSize: 16, color: "var(--b-ink-2)", margin: "0 0 28px" }}>
              Adresa se na inzerátu nezobrazí přesně — zveřejníme jen město a čtvrť.
            </p>
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                border: "1px solid var(--b-line)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <Field label="Město nebo čtvrť">
                <div style={{ position: "relative" }}>
                  <input
                    value={whereQuery || form.city}
                    onFocus={() => setWhereOpen(true)}
                    onChange={(e) => {
                      setWhereQuery(e.target.value);
                      setWhereOpen(true);
                    }}
                    placeholder="Praha, Brno, Ostrava…"
                    style={bInput}
                  />
                  {whereOpen && citySuggestions.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid var(--b-line)",
                        borderRadius: 12,
                        boxShadow: "var(--b-shadow)",
                        zIndex: 10,
                        maxHeight: 240,
                        overflowY: "auto",
                      }}
                    >
                      {citySuggestions.map((c) => (
                        <div
                          key={c}
                          onClick={() => {
                            const parts = c.split(" — ");
                            update("city", parts[0]);
                            update("district", parts.length > 1 ? c : "");
                            setWhereQuery("");
                            setWhereOpen(false);
                          }}
                          style={{
                            padding: "10px 14px",
                            fontSize: 14,
                            cursor: "pointer",
                            borderBottom: "1px solid var(--b-line-2)",
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                <Field label="Ulice a č. p. (volitelné)">
                  <input
                    value={form.street}
                    onChange={(e) => update("street", e.target.value)}
                    placeholder="Např. Dukelských hrdinů 42"
                    style={bInput}
                  />
                </Field>
                <Field label="PSČ">
                  <input
                    value={form.zip_code}
                    onChange={(e) => update("zip_code", e.target.value)}
                    placeholder="170 00"
                    style={bInput}
                  />
                </Field>
              </div>
              {form.city && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    background: "var(--b-primary-soft)",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "var(--b-primary)",
                  }}
                >
                  <Icon name="check" size={14} /> Vybráno: {form.district || form.city}
                </div>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 42,
                margin: "12px 0 12px",
                fontWeight: 400,
                letterSpacing: -1,
                lineHeight: 1.05,
              }}
            >
              Povězte nám víc o <em style={{ color: "var(--b-accent)", fontStyle: "italic" }}>vašem</em> bydlení.
            </h1>
            <p style={{ fontSize: 16, color: "var(--b-ink-2)", margin: "0 0 28px" }}>
              Pár základních údajů a je hotovo.
            </p>
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                border: "1px solid var(--b-line)",
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              <Field label="Dispozice">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {DISPOSITIONS.map((d) => (
                    <Pill
                      key={d}
                      active={form.disposition === d}
                      onClick={() => update("disposition", d)}
                    >
                      {d}
                    </Pill>
                  ))}
                </div>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <Field label="Plocha (m²)">
                  <input
                    value={form.area}
                    onChange={(e) => update("area", e.target.value.replace(/\D/g, ""))}
                    placeholder="85"
                    inputMode="numeric"
                    style={bInput}
                  />
                </Field>
                <Field label="Patro / z celkem">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input
                      value={form.floor}
                      onChange={(e) => update("floor", e.target.value.replace(/\D/g, ""))}
                      placeholder="3"
                      style={bInput}
                    />
                    <input
                      value={form.total_floors}
                      onChange={(e) => update("total_floors", e.target.value.replace(/\D/g, ""))}
                      placeholder="5"
                      style={bInput}
                    />
                  </div>
                </Field>
                <Field label="Stav nemovitosti">
                  <select
                    value={form.condition_note}
                    onChange={(e) => update("condition_note", e.target.value)}
                    style={bInput}
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Energetická třída">
                  <select
                    value={form.energy_class}
                    onChange={(e) => update("energy_class", e.target.value)}
                    style={bInput}
                  >
                    <option value="">—</option>
                    {ENERGY.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Vybavenost">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { k: "has_balcony", l: "Balkon / terasa" },
                    { k: "has_parking", l: "Parkování" },
                    { k: "has_garden", l: "Zahrada" },
                    { k: "has_elevator", l: "Výtah" },
                  ].map((f) => (
                    <Pill key={f.k} active={form[f.k]} onClick={() => update(f.k, !form[f.k])}>
                      {form[f.k] && (
                        <Icon name="check" size={12} style={{ marginRight: 6, verticalAlign: -1 }} />
                      )}
                      {f.l}
                    </Pill>
                  ))}
                </div>
              </Field>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 42,
                margin: "12px 0 12px",
                fontWeight: 400,
                letterSpacing: -1,
                lineHeight: 1.05,
              }}
            >
              <em style={{ color: "var(--b-accent)", fontStyle: "italic" }}>Fotky</em> jsou polovina úspěchu.
            </h1>
            <p style={{ fontSize: 16, color: "var(--b-ink-2)", margin: "0 0 28px" }}>
              V této MVP verzi si vybereme reprezentativní vizuál — upload fotek přidáme brzy.
            </p>
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                border: "1px solid var(--b-line)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                <PropPhoto seed={1} style={{ aspectRatio: "4/3", borderRadius: 14 }} />
                <PropPhoto seed={3} style={{ aspectRatio: "4/3", borderRadius: 14 }} />
                <PropPhoto seed={6} style={{ aspectRatio: "4/3", borderRadius: 14 }} />
              </div>
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  background: "var(--b-cream)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "var(--b-ink-2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icon name="info" size={14} /> Upload reálných fotek přes Supabase Storage přidáme v další iteraci.
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h1
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 42,
                margin: "12px 0 12px",
                fontWeight: 400,
                letterSpacing: -1,
                lineHeight: 1.05,
              }}
            >
              Za kolik <em style={{ color: "var(--b-accent)", fontStyle: "italic" }}>nabízíte</em>?
            </h1>
            <p style={{ fontSize: 16, color: "var(--b-ink-2)", margin: "0 0 28px" }}>
              Zadejte cenu v Kč a napište pár vět k inzerátu. Popis můžete dopsat i později.
            </p>
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                border: "1px solid var(--b-line)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <Field
                label={form.offer_type === "pronajem" ? "Cena (Kč / měsíc)" : "Cena (Kč)"}
                hint={
                  form.price && form.area
                    ? `Cena za m²: ${Math.round(parseInt(form.price, 10) / parseInt(form.area, 10)).toLocaleString("cs-CZ")} Kč`
                    : null
                }
              >
                <input
                  value={form.price}
                  onChange={(e) => update("price", e.target.value.replace(/\D/g, ""))}
                  placeholder={form.offer_type === "pronajem" ? "25000" : "8490000"}
                  inputMode="numeric"
                  style={{ ...bInput, fontSize: 22, fontWeight: 500 }}
                />
              </Field>
              <Field label="Popis (volitelné)">
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Několik vět o nemovitosti — co ji dělá zvláštní, čím je výjimečná, co byste rádi zdůraznili."
                  style={{ ...bInput, resize: "vertical", lineHeight: 1.5 }}
                />
              </Field>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h1
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 42,
                margin: "12px 0 12px",
                fontWeight: 400,
                letterSpacing: -1,
                lineHeight: 1.05,
              }}
            >
              Kdo inzerát <em style={{ color: "var(--b-accent)", fontStyle: "italic" }}>publikuje</em>?
            </h1>
            <p style={{ fontSize: 16, color: "var(--b-ink-2)", margin: "0 0 28px" }}>
              Kontaktní údaje uvidí zájemci, kteří vás budou chtít oslovit.
            </p>
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                border: "1px solid var(--b-line)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <Field label="Inzeruji jako">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {SELLER_KINDS.map((s) => (
                    <Pill
                      key={s.v}
                      active={form.seller_kind === s.v}
                      onClick={() => update("seller_kind", s.v)}
                    >
                      {s.l}
                    </Pill>
                  ))}
                </div>
              </Field>
              <Field label="Jméno / název firmy">
                <input
                  value={form.seller_name}
                  onChange={(e) => update("seller_name", e.target.value)}
                  placeholder="Jan Novák"
                  style={bInput}
                />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="E-mail">
                  <input
                    type="email"
                    value={form.seller_email}
                    onChange={(e) => update("seller_email", e.target.value)}
                    placeholder="jan@example.cz"
                    style={bInput}
                  />
                </Field>
                <Field label="Telefon (volitelné)">
                  <input
                    value={form.seller_phone}
                    onChange={(e) => update("seller_phone", e.target.value)}
                    placeholder="+420 777 123 456"
                    style={bInput}
                  />
                </Field>
              </div>

              {/* Review summary */}
              <div
                style={{
                  marginTop: 6,
                  padding: 18,
                  background: "var(--b-primary-soft)",
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--b-mono)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "var(--b-primary)",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Shrnutí inzerátu
                </div>
                <div
                  style={{
                    fontFamily: "var(--b-display)",
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: -0.3,
                  }}
                >
                  {buildTitle(form) || "—"}
                </div>
                <div style={{ fontSize: 13, color: "var(--b-ink-2)", marginTop: 4 }}>
                  {form.area && `${form.area} m²`}
                  {form.floor && ` · ${form.floor}. patro`}
                  {form.condition_note && ` · ${form.condition_note}`}
                </div>
                <div
                  style={{
                    fontFamily: "var(--b-display)",
                    fontSize: 24,
                    fontWeight: 500,
                    color: "var(--b-primary)",
                    marginTop: 8,
                  }}
                >
                  {form.price
                    ? `${parseInt(form.price, 10).toLocaleString("cs-CZ")} Kč${form.offer_type === "pronajem" ? " / měsíc" : ""}`
                    : "—"}
                </div>
              </div>

              {error && (
                <div
                  style={{
                    padding: 12,
                    background: "#FDECEC",
                    border: "1px solid #F0B5B5",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "#8C2E2E",
                  }}
                >
                  Chyba při publikaci: {error}
                </div>
              )}
            </div>
          </>
        )}

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              background: "transparent",
              color: step === 1 ? "var(--b-muted)" : "var(--b-ink-2)",
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: step === 1 ? "default" : "pointer",
            }}
          >
            <Icon name="chevron-left" size={14} /> Zpět
          </button>
          <div style={{ fontSize: 13, color: "var(--b-muted)" }}>
            Krok {step} / 6
          </div>
          {step < 6 ? (
            <button
              type="button"
              onClick={() => canContinue() && setStep((s) => s + 1)}
              disabled={!canContinue()}
              style={{
                padding: "12px 28px",
                background: canContinue() ? "var(--b-primary)" : "var(--b-line)",
                color: canContinue() ? "var(--b-cream)" : "var(--b-muted)",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: canContinue() ? "pointer" : "not-allowed",
              }}
            >
              Pokračovat <Icon name="arrow-right" size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => canContinue() && !submitting && submit()}
              disabled={!canContinue() || submitting}
              style={{
                padding: "12px 28px",
                background: canContinue() && !submitting ? "var(--b-accent)" : "var(--b-line)",
                color: canContinue() && !submitting ? "#fff" : "var(--b-muted)",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: canContinue() && !submitting ? "pointer" : "not-allowed",
              }}
            >
              {submitting ? "Publikuji…" : "Publikovat inzerát"} <Icon name="check" size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
