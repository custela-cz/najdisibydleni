"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildTitle } from "@/lib/supabase/shared";
import { geocodeAddress } from "@/lib/geocode";

export async function publishListing(formDataRaw) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Musíte být přihlášeni." };

  const form = JSON.parse(formDataRaw);

  const title = buildTitle({
    property_type: form.property_type,
    disposition: form.disposition,
    city: form.city,
    district: form.district,
  });

  const coords = await geocodeAddress({
    street: form.street,
    zip: form.zip_code,
    district: form.district,
    city: form.city,
  });

  const payload = {
    user_id: user.id,
    title,
    description: form.description || "",
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
    has_balcony: !!form.has_balcony,
    has_parking: !!form.has_parking,
    has_garden: !!form.has_garden,
    has_elevator: !!form.has_elevator,
    seller_name: form.seller_name || null,
    seller_email: form.seller_email || user.email,
    seller_phone: form.seller_phone || null,
    seller_kind: form.seller_kind || "owner",
    seed_index: Math.floor(Math.random() * 10),
    latitude: coords?.latitude ?? null,
    longitude: coords?.longitude ?? null,
    main_image_url: form.main_image_url || null,
  };

  const { data: inserted, error } = await supabase
    .from("properties")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { error: error.message };

  if (Array.isArray(form.image_urls) && form.image_urls.length > 0) {
    const rows = form.image_urls.map((url, i) => ({
      property_id: inserted.id,
      url,
      position: i,
    }));
    await supabase.from("property_images").insert(rows);
    if (!payload.main_image_url) {
      await supabase
        .from("properties")
        .update({ main_image_url: form.image_urls[0] })
        .eq("id", inserted.id);
    }
  }

  revalidatePath("/");
  revalidatePath("/koupit");
  revalidatePath("/dashboard");
  redirect(`/inzerat/${inserted.id}?nove=1`);
}
