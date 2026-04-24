import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

const PROPERTY_TYPE_LABEL = {
  byt: "Byt",
  dum: "Dům",
  pozemek: "Pozemek",
  chata: "Chata",
  novostavba: "Novostavba",
  komercni: "Komerční",
};

export function buildTitle({ property_type, disposition, city, district }) {
  const t = PROPERTY_TYPE_LABEL[property_type] || "Nemovitost";
  const parts = [t];
  if (disposition) parts.push(disposition);
  const place = district || city;
  if (place) parts.push("v " + place);
  return parts.join(" ").trim();
}

export function formatPriceCZK(price, offerType) {
  if (!price) return "—";
  const fmt = new Intl.NumberFormat("cs-CZ").format(price);
  if (offerType === "pronajem") return `${fmt} Kč / měsíc`;
  if (price >= 1_000_000) {
    const mil = (price / 1_000_000).toLocaleString("cs-CZ", { maximumFractionDigits: 2 });
    return `${mil} mil. Kč`;
  }
  return `${fmt} Kč`;
}

export function mapRowToListing(r) {
  return {
    id: r.id,
    seed: r.seed_index ?? 1,
    title: r.title,
    place: [r.district, r.city].filter(Boolean).join(" — ") || r.city || "",
    price: formatPriceCZK(r.price, r.offer_type),
    rawPrice: r.price,
    area: r.area,
    disp: r.disposition || "",
    type: r.property_type,
    offer_type: r.offer_type,
    description: r.description,
    floor: r.floor,
    total_floors: r.total_floors,
    city: r.city,
    district: r.district,
    street: r.street,
    zip_code: r.zip_code,
    condition_note: r.condition_note,
    energy_class: r.energy_class,
    seller_name: r.seller_name,
    seller_kind: r.seller_kind,
    created_at: r.created_at,
  };
}
