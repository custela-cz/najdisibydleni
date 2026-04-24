import Link from "next/link";
import { notFound } from "next/navigation";
import { BHeader } from "@/components/header";
import { BFooter } from "@/components/footer";
import LeafletMap from "@/components/leaflet-map";
import { Icon, PropPhoto, bPage, sellerBadge } from "@/components/shared";
import { createClient } from "@/lib/supabase/server";
import { mapRowToListing, formatPriceCZK } from "@/lib/supabase/shared";

export const revalidate = 30;

async function getProperty(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(url, position)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const images = (data.property_images || [])
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((i) => i.url);
  return { row: data, listing: mapRowToListing(data), images };
}

function GalleryImage({ src, fallbackSeed, style, children }) {
  if (src) {
    return (
      <div style={{ position: "relative", ...style }}>
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {children}
      </div>
    );
  }
  return (
    <div style={{ position: "relative", ...style }}>
      <PropPhoto seed={fallbackSeed} style={{ height: "100%" }} />
      {children}
    </div>
  );
}

export default async function DetailPage({ params, searchParams }) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : {};
  const justCreated = sp.nove === "1";

  const result = await getProperty(id);
  if (!result) notFound();
  const { row, listing, images } = result;

  const badge = sellerBadge[row.seller_kind] || sellerBadge.owner;
  const pricePerM2 = row.price && row.area ? Math.round(row.price / row.area) : null;

  const galleryImages = images.length > 0
    ? images
    : row.main_image_url
    ? [row.main_image_url]
    : [];

  const hasCoords = row.latitude != null && row.longitude != null;

  return (
    <div className="ab v-b" style={bPage}>
      <BHeader />

      {justCreated && (
        <div style={{ maxWidth: 1280, margin: "20px auto 0", padding: "0 32px" }}>
          <div
            style={{
              padding: "14px 20px",
              background: "var(--b-primary-soft)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "var(--b-primary)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Icon name="check" size={18} /> Inzerát byl úspěšně publikován.
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px 0" }}>
        <Link
          href="/koupit"
          style={{ fontSize: 13, color: "var(--b-muted)", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Icon name="chevron-left" size={13} /> Zpět na výsledky
        </Link>
      </div>

      {/* Hero gallery */}
      <div style={{ maxWidth: 1280, margin: "16px auto 0", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 8,
            borderRadius: 20,
            overflow: "hidden",
            height: 520,
          }}
        >
          <GalleryImage
            src={galleryImages[0]}
            fallbackSeed={listing.seed}
            style={{ height: "100%" }}
          />
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 8 }}>
            <GalleryImage
              src={galleryImages[1]}
              fallbackSeed={(listing.seed + 1) % 10}
              style={{ height: "100%" }}
            />
            <GalleryImage
              src={galleryImages[2]}
              fallbackSeed={(listing.seed + 2) % 10}
              style={{ height: "100%" }}
            >
              {galleryImages.length > 3 && (
                <button
                  style={{
                    position: "absolute",
                    inset: 8,
                    background: "rgba(23,24,27,.6)",
                    color: "#fff",
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Icon name="camera" size={15} /> + {galleryImages.length - 3} dalších fotek
                </button>
              )}
            </GalleryImage>
          </div>
        </div>
      </div>

      {/* Content */}
      <section
        style={{
          maxWidth: 1280,
          margin: "48px auto 0",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 48,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              background: badge.bg,
              color: badge.c,
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "var(--b-mono)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: 999, background: badge.c }} />
            {badge.l}
          </div>
          <div style={{ fontSize: 13, color: "var(--b-muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="pin" size={13} /> {listing.place}
          </div>
          <h1
            style={{
              fontFamily: "var(--b-display)",
              fontSize: 56,
              lineHeight: 1.02,
              fontWeight: 400,
              margin: "12px 0 0",
              letterSpacing: -1.5,
            }}
          >
            {listing.title}
          </h1>
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: 28,
              paddingTop: 28,
              borderTop: "1px solid var(--b-line-2)",
              flexWrap: "wrap",
            }}
          >
            {[
              { l: "Plocha", v: `${row.area} m²` },
              { l: "Dispozice", v: row.disposition || "—" },
              row.floor
                ? {
                    l: "Patro",
                    v: `${row.floor}${row.total_floors ? ` / ${row.total_floors}` : ""}.`,
                  }
                : null,
              row.condition_note ? { l: "Stav", v: row.condition_note } : null,
              row.energy_class ? { l: "Energie", v: row.energy_class } : null,
            ]
              .filter(Boolean)
              .map((s) => (
                <div key={s.l}>
                  <div style={{ fontFamily: "var(--b-display)", fontSize: 26, fontWeight: 500 }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: "var(--b-muted)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
          </div>

          {row.description && (
            <div style={{ marginTop: 40 }}>
              <h2
                style={{
                  fontFamily: "var(--b-display)",
                  fontSize: 28,
                  fontWeight: 400,
                  margin: "0 0 12px",
                  letterSpacing: -0.5,
                }}
              >
                O této nemovitosti
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--b-ink-2)", whiteSpace: "pre-wrap" }}>
                {row.description}
              </p>
            </div>
          )}

          {[
            row.has_balcony && "Balkon",
            row.has_garden && "Zahrada",
            row.has_parking && "Parkování",
            row.has_elevator && "Výtah",
            row.energy_class && `Energie ${row.energy_class}`,
          ].filter(Boolean).length > 0 && (
            <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                row.has_balcony && "Balkon",
                row.has_garden && "Zahrada",
                row.has_parking && "Parkování",
                row.has_elevator && "Výtah",
                row.energy_class && `Energie ${row.energy_class}`,
                row.condition_note,
              ]
                .filter(Boolean)
                .map((f) => (
                  <div
                    key={f}
                    style={{
                      padding: "14px 16px",
                      background: "#fff",
                      borderRadius: 12,
                      border: "1px solid var(--b-line)",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {f}
                  </div>
                ))}
            </div>
          )}

          {/* Map */}
          {hasCoords && (
            <div style={{ marginTop: 48 }}>
              <h2
                style={{
                  fontFamily: "var(--b-display)",
                  fontSize: 28,
                  fontWeight: 400,
                  margin: "0 0 16px",
                  letterSpacing: -0.5,
                }}
              >
                Lokalita
              </h2>
              <LeafletMap
                markers={[
                  {
                    id: row.id,
                    title: listing.title,
                    place: listing.place,
                    price: listing.price,
                    rawPrice: row.price,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    active: true,
                  },
                ]}
                center={[row.latitude, row.longitude]}
                zoom={14}
                height={440}
                singleActive
              />
              <div style={{ fontSize: 12, color: "var(--b-muted)", marginTop: 8 }}>
                Přesná poloha je přibližná — pro ochranu soukromí zobrazujeme jen orientační místo.
              </div>
            </div>
          )}
        </div>

        {/* Contact card */}
        <aside>
          <div
            style={{
              position: "sticky",
              top: 24,
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              border: "1px solid var(--b-line)",
            }}
          >
            <div style={{ fontSize: 13, color: "var(--b-muted)" }}>Cena</div>
            <div
              style={{
                fontFamily: "var(--b-display)",
                fontSize: 40,
                fontWeight: 400,
                color: "var(--b-primary)",
                letterSpacing: -1,
                lineHeight: 1.1,
              }}
            >
              {formatPriceCZK(row.price, row.offer_type)}
            </div>
            {pricePerM2 && (
              <div style={{ fontSize: 13, color: "var(--b-muted)" }}>
                {pricePerM2.toLocaleString("cs-CZ")} Kč/m²
              </div>
            )}

            {row.seller_name && (
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "16px 0",
                  borderTop: "1px solid var(--b-line-2)",
                  borderBottom: "1px solid var(--b-line-2)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    background: "var(--b-cream)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--b-display)",
                    fontSize: 18,
                  }}
                >
                  {row.seller_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{row.seller_name}</div>
                  <div style={{ fontSize: 12, color: "var(--b-muted)" }}>{badge.l}</div>
                </div>
              </div>
            )}

            {row.seller_email && (
              <a
                href={`mailto:${row.seller_email}`}
                style={{
                  marginTop: 20,
                  width: "100%",
                  padding: 14,
                  background: "var(--b-primary)",
                  color: "var(--b-cream)",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Napsat e-mail
              </a>
            )}
            {row.seller_phone && (
              <a
                href={`tel:${row.seller_phone.replace(/\s/g, "")}`}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: 14,
                  background: "#fff",
                  border: "1px solid var(--b-line)",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icon name="phone" size={14} /> {row.seller_phone}
              </a>
            )}
          </div>
        </aside>
      </section>
      <BFooter />
    </div>
  );
}
