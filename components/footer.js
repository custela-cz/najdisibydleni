import { B2Logo } from "./logo";

export const B2Footer = () => (
  <footer
    style={{
      marginTop: 120,
      background: "var(--b-primary)",
      color: "var(--b-cream)",
      padding: "80px 32px 32px",
    }}
  >
    <div style={{ maxWidth: 1320, margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
          gap: 40,
          paddingBottom: 48,
          borderBottom: "1px solid rgba(239,232,218,.15)",
        }}
      >
        <div>
          <B2Logo size={32} />
          <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6, opacity: 0.8, maxWidth: 340 }}>
            Dobře udělaný realitní portál pro kupce, soukromé prodejce, makléře i developery. Bez umělého tlaku, bez triků.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
            {["IG", "FB", "YT", "IN"].map((s) => (
              <div
                key={s}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: "1px solid rgba(239,232,218,.3)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontFamily: "var(--b-mono)",
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        {[
          { t: "Pro hledající", i: ["Koupit", "Pronajmout", "Novostavby", "Uložená hledání", "Hypotéka", "Odhad ceny"] },
          { t: "Pro prodávající", i: ["Vložit inzerát", "Ceník pro soukromé", "Jak na inzerát", "Magazín"] },
          { t: "Pro makléře a RK", i: ["Profesionální účet", "Hromadný import", "API a CRM", "Ceník pro makléře", "Partnerský program"] },
          { t: "Firma", i: ["O nás", "Kariéra", "Kontakt", "Obchodní podmínky", "Ochrana údajů"] },
        ].map((c) => (
          <div key={c.t}>
            <div
              style={{
                fontFamily: "var(--b-mono)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                opacity: 0.6,
                marginBottom: 18,
              }}
            >
              {c.t}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 14,
              }}
            >
              {c.i.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 32,
          fontSize: 12,
          opacity: 0.6,
          fontFamily: "var(--b-mono)",
        }}
      >
        <span>© 2026 najdisibydleni.cz</span>
        <span>Praha · IČO 12345678</span>
      </div>
    </div>
  </footer>
);

export const BFooter = () => (
  <footer
    style={{
      marginTop: 100,
      background: "var(--b-primary)",
      color: "var(--b-cream)",
      padding: "64px 32px 32px",
    }}
  >
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
        gap: 40,
      }}
    >
      <div>
        <div style={{ fontFamily: "var(--b-display)", fontSize: 28, fontStyle: "italic", fontWeight: 400 }}>
          najdisibydlení
        </div>
        <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, opacity: 0.8, maxWidth: 340 }}>
          Dobře udělaný realitní portál pro kupce, soukromé prodejce, makléře i developery. Bez umělého tlaku, bez triků.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
          {["IG", "FB", "YT", "IN"].map((s) => (
            <div
              key={s}
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "1px solid rgba(239,232,218,.3)",
                display: "grid",
                placeItems: "center",
                fontSize: 12,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
      {[
        { t: "Pro hledající", i: ["Vyhledat", "Uložená hledání", "Oblíbené", "Hypotéka", "Magazín"] },
        { t: "Pro prodávající", i: ["Vložit inzerát", "Odhad ceny", "Ceník", "Pro makléře", "Partneři"] },
        { t: "Firma", i: ["O nás", "Kariéra", "Kontakt", "Podmínky", "Cookies"] },
      ].map((c) => (
        <div key={c.t}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: 16,
            }}
          >
            {c.t}
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 14,
            }}
          >
            {c.i.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </footer>
);
