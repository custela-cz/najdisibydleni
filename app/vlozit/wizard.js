"use client";

import { useRef, useState, useTransition } from "react";
import { Icon, PropPhoto, bInput } from "@/components/shared";
import { buildTitle } from "@/lib/supabase/shared";
import { createClient } from "@/lib/supabase/browser";
import { CITIES, DISPOSITIONS } from "@/components/search-bar";
import { publishListing } from "./actions";

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

export default function Wizard({ user }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

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
    seller_name: user.full_name || "",
    seller_email: user.email || "",
    seller_phone: "",
    seller_kind: "owner",
    image_urls: [],
    main_image_url: null,
  });

  const [whereQuery, setWhereQuery] = useState("");
  const [whereOpen, setWhereOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

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

  const onFilesSelected = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    const supabase = createClient();
    const newUrls = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("property-images")
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("property-images").getPublicUrl(path);
        newUrls.push(pub.publicUrl);
      }
      setForm((prev) => {
        const combined = [...prev.image_urls, ...newUrls];
        return {
          ...prev,
          image_urls: combined,
          main_image_url: prev.main_image_url || combined[0] || null,
        };
      });
    } catch (e) {
      setUploadError(e.message || "Chyba při uploadu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (url) =>
    setForm((prev) => {
      const image_urls = prev.image_urls.filter((u) => u !== url);
      return {
        ...prev,
        image_urls,
        main_image_url: prev.main_image_url === url ? image_urls[0] || null : prev.main_image_url,
      };
    });

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await publishListing(JSON.stringify(form));
      if (result?.error) setError(result.error);
    });
  };

  const citySuggestions = (() => {
    const q = whereQuery.trim().toLowerCase();
    if (!q) return CITIES.slice(0, 10);
    const fold = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return CITIES.filter((c) => fold(c).includes(fold(q))).slice(0, 10);
  })();

  return (
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
                <Pill active={form.offer_type === "prodej"} onClick={() => update("offer_type", "prodej")}>
                  Prodej
                </Pill>
                <Pill active={form.offer_type === "pronajem"} onClick={() => update("offer_type", "pronajem")}>
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
            Přesná adresa pomáhá při geokódování — na inzerátu se zobrazí jen město a čtvrť.
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
                          const hasDash = c.includes(" — ");
                          update("city", hasDash ? c.split(" — ")[0] : c);
                          update("district", hasDash ? c : "");
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
              <Field label="Ulice a č. p.">
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
                  <Pill key={d} active={form.disposition === d} onClick={() => update("disposition", d)}>
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
            Nahrajte fotky v JPG/PNG — zvolte hlavní fotku, která se zobrazí jako úvodní.
          </p>
          <div style={{ background: "#fff", borderRadius: 24, padding: 28, border: "1px solid var(--b-line)" }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--b-line)",
                borderRadius: 16,
                padding: "32px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: "var(--b-bg)",
              }}
            >
              <Icon name="upload" size={28} style={{ color: "var(--b-primary)" }} />
              <div style={{ marginTop: 10, fontSize: 16, fontWeight: 500, color: "var(--b-ink)" }}>
                Klikněte pro výběr fotek
              </div>
              <div style={{ fontSize: 13, color: "var(--b-muted)", marginTop: 4 }}>
                JPG / PNG / WebP · bez limitu počtu
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => onFilesSelected(e.target.files)}
              />
            </div>
            {uploading && (
              <div style={{ marginTop: 12, fontSize: 13, color: "var(--b-primary)" }}>
                Nahrávám fotky…
              </div>
            )}
            {uploadError && (
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  background: "#FDECEC",
                  border: "1px solid #F0B5B5",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#8C2E2E",
                }}
              >
                {uploadError}
              </div>
            )}
            {form.image_urls.length > 0 && (
              <div
                style={{
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                {form.image_urls.map((url) => (
                  <div key={url} style={{ position: "relative" }}>
                    <img
                      src={url}
                      alt=""
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        borderRadius: 12,
                        border:
                          form.main_image_url === url
                            ? "2px solid var(--b-primary)"
                            : "1px solid var(--b-line)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 6,
                        left: 6,
                        right: 6,
                        display: "flex",
                        gap: 4,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => update("main_image_url", url)}
                        style={{
                          flex: 1,
                          padding: "4px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          background:
                            form.main_image_url === url ? "var(--b-primary)" : "rgba(255,255,255,.9)",
                          color: form.main_image_url === url ? "#fff" : "var(--b-ink)",
                        }}
                      >
                        {form.main_image_url === url ? "Hlavní ✓" : "Nastavit jako hlavní"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        style={{
                          width: 28,
                          height: 22,
                          borderRadius: 999,
                          background: "rgba(255,255,255,.9)",
                          color: "var(--b-ink)",
                          display: "grid",
                          placeItems: "center",
                        }}
                        title="Smazat"
                      >
                        <Icon name="x" size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {form.image_urls.length === 0 && !uploading && (
              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  opacity: 0.5,
                }}
              >
                <PropPhoto seed={1} style={{ aspectRatio: "4/3", borderRadius: 14 }} />
                <PropPhoto seed={3} style={{ aspectRatio: "4/3", borderRadius: 14 }} />
                <PropPhoto seed={6} style={{ aspectRatio: "4/3", borderRadius: 14 }} />
              </div>
            )}
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
                  ? `Cena za m²: ${Math.round(
                      parseInt(form.price, 10) / parseInt(form.area, 10)
                    ).toLocaleString("cs-CZ")} Kč`
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
                placeholder="Několik vět o nemovitosti — co ji dělá zvláštní, čím je výjimečná."
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

            <div style={{ marginTop: 6, padding: 18, background: "var(--b-primary-soft)", borderRadius: 14 }}>
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
                {form.image_urls.length > 0 && ` · ${form.image_urls.length} fotek`}
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
                  ? `${parseInt(form.price, 10).toLocaleString("cs-CZ")} Kč${
                      form.offer_type === "pronajem" ? " / měsíc" : ""
                    }`
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
        <div style={{ fontSize: 13, color: "var(--b-muted)" }}>Krok {step} / 6</div>
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
            onClick={() => canContinue() && !isPending && submit()}
            disabled={!canContinue() || isPending}
            style={{
              padding: "12px 28px",
              background: canContinue() && !isPending ? "var(--b-accent)" : "var(--b-line)",
              color: canContinue() && !isPending ? "#fff" : "var(--b-muted)",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: canContinue() && !isPending ? "pointer" : "not-allowed",
            }}
          >
            {isPending ? "Publikuji…" : "Publikovat inzerát"} <Icon name="check" size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
