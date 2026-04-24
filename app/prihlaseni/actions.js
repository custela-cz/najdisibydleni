"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const next = formData.get("next")?.toString() || "/";
  if (!email || !password) return { error: "Vyplňte e-mail a heslo." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUp(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString().trim() || "";
  const next = formData.get("next")?.toString() || "/";
  if (!email || !password) return { error: "Vyplňte e-mail a heslo." };
  if (password.length < 6) return { error: "Heslo musí mít alespoň 6 znaků." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };
  if (!data.session) {
    return { info: "Zkontrolujte e-mail a potvrďte registraci." };
  }
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
