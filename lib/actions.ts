"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---------- Auth ----------

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Settings ----------

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    recipient_name: String(formData.get("recipient_name") ?? ""),
    age: Number(formData.get("age") ?? 0),
    birthday_month: Number(formData.get("birthday_month") ?? 0),
    birthday_day: Number(formData.get("birthday_day") ?? 1),
    birthday_hour: Number(formData.get("birthday_hour") ?? 0),
    birthday_minute: Number(formData.get("birthday_minute") ?? 0),
    greeting_text: String(formData.get("greeting_text") ?? ""),
    cake_title: String(formData.get("cake_title") ?? ""),
    countdown_audio_url: String(formData.get("countdown_audio_url") ?? "") || null,
    birthday_audio_url: String(formData.get("birthday_audio_url") ?? "") || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateContactSettings(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    facebook_url: String(formData.get("facebook_url") ?? "") || null,
    instagram_url: String(formData.get("instagram_url") ?? "") || null,
    contact_email: String(formData.get("contact_email") ?? "") || null,
    whatsapp_url: String(formData.get("whatsapp_url") ?? "") || null,
    emailjs_public_key: String(formData.get("emailjs_public_key") ?? "") || null,
    emailjs_service_id: String(formData.get("emailjs_service_id") ?? "") || null,
    emailjs_template_id: String(formData.get("emailjs_template_id") ?? "") || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/contact");
}

export async function updateLetter(formData: FormData) {
  const supabase = await createClient();
  const payload = {
    letter_title: String(formData.get("letter_title") ?? ""),
    letter_content: String(formData.get("letter_content") ?? ""),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/letter");
}

export async function updateSecret(formData: FormData) {
  const supabase = await createClient();
  const payload = {
    secret_photo_url: String(formData.get("secret_photo_url") ?? "") || null,
    secret_button_label: String(formData.get("secret_button_label") ?? ""),
    secret_button_link: String(formData.get("secret_button_link") ?? "") || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/secret");
}

// ---------- Reasons ----------

export async function addReason(formData: FormData) {
  const supabase = await createClient();
  const text = String(formData.get("text") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "💖").trim();
  if (!text) return;

  const { data: existing } = await supabase.from("reasons").select("order_index");
  const nextOrder = (existing ?? []).reduce((max, r) => Math.max(max, r.order_index), -1) + 1;

  const { error } = await supabase.from("reasons").insert({ text, emoji, order_index: nextOrder });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/reasons");
}

export async function deleteReason(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reasons").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/reasons");
}

export async function updateReason(id: string, formData: FormData) {
  const supabase = await createClient();
  const text = String(formData.get("text") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "💖").trim();

  const { error } = await supabase.from("reasons").update({ text, emoji }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/reasons");
}

// ---------- Photos ----------

export async function addPhoto(formData: FormData) {
  const supabase = await createClient();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  if (!image_url) return;

  const { data: existing } = await supabase.from("photos").select("order_index");
  const nextOrder = (existing ?? []).reduce((max, r) => Math.max(max, r.order_index), -1) + 1;

  const { error } = await supabase.from("photos").insert({ image_url, title, caption, order_index: nextOrder });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/photos");
}

export async function deletePhoto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/photos");
}

export async function updatePhoto(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();

  const { error } = await supabase.from("photos").update({ title, caption }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/photos");
}

// ---------- Videos ----------

export async function addVideo(formData: FormData) {
  const supabase = await createClient();
  const video_url = String(formData.get("video_url") ?? "").trim();
  const poster_url = String(formData.get("poster_url") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  if (!video_url) return;

  const { data: existing } = await supabase.from("videos").select("order_index");
  const nextOrder = (existing ?? []).reduce((max, r) => Math.max(max, r.order_index), -1) + 1;

  const { error } = await supabase.from("videos").insert({ video_url, poster_url, title, order_index: nextOrder });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/videos");
}

export async function deleteVideo(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/videos");
}

export async function updateVideo(id: string, formData: FormData) {
  const supabase = await createClient();
  const video_url = String(formData.get("video_url") ?? "").trim();
  const poster_url = String(formData.get("poster_url") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();

  const { error } = await supabase
    .from("videos")
    .update({ video_url, poster_url, title })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/videos");
}
