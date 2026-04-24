// Geocoding via OpenStreetMap Nominatim (free, fair-use).
// Server-side only — respects Nominatim usage policy.

export async function geocodeAddress({ street, zip, district, city }) {
  const addressParts = [street, zip, district, city, "Česká republika"].filter(Boolean);
  const q = addressParts.join(", ");
  if (!city) return null;

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("q", q);
    url.searchParams.set("countrycodes", "cz");
    url.searchParams.set("limit", "1");
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "najdisibydleni.cz/1.0 (cetlppc@gmail.com)",
        "Accept-Language": "cs",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const [hit] = data;
    return {
      latitude: parseFloat(hit.lat),
      longitude: parseFloat(hit.lon),
    };
  } catch {
    return null;
  }
}
