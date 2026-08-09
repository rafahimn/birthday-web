"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// ---------- Auth ----------

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const invite = String(formData.get("invite") ?? "").trim();
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    const inviteQuery = invite ? `&invite=${encodeURIComponent(invite)}` : "";
    redirect(`/signup?error=${encodeURIComponent(error.message)}${inviteQuery}`);
  }

  // If they came through an admin-shared invite link, auto-approve the
  // account right now (works because signUp just signed them in).
  if (invite) {
    await supabase.rpc("approve_via_invite", { p_token: invite });
  }

  // Always require an explicit login afterwards, rather than leaving
  // them auto-signed-in from signUp.
  await supabase.auth.signOut();
  redirect("/login?created=1");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ---------- Forgot / reset password ----------

/** Sends a password-reset email. Always redirects to the same "check your email" screen,
 *  whether or not the email exists — this avoids leaking which emails have accounts. */
export async function forgotPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  redirect("/forgot-password?sent=1");
}

/** Sets a new password. Only works right after clicking the emailed reset link,
 *  which signs the user into a temporary recovery session via /auth/callback. */
export async function resetPassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (password.length < 6) {
    redirect(`/reset-password?error=${encodeURIComponent("পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে।")}`);
  }
  if (password !== confirmPassword) {
    redirect(`/reset-password?error=${encodeURIComponent("দুইটা পাসওয়ার্ড মিলছে না।")}`);
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    redirect(`/forgot-password?error=${encodeURIComponent("লিংকটার মেয়াদ শেষ হয়ে গেছে, আবার চেষ্টা করো।")}`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.auth.signOut();
  redirect("/login?reset=1");
}

// ---------- Ownership helper ----------

async function requireOwnedSite(siteId: string) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not signed in");

  const { data: site } = await supabase.from("sites").select("id, owner_id").eq("id", siteId).maybeSingle();
  if (!site || site.owner_id !== auth.user.id) throw new Error("Site not found");

  return { supabase, userId: auth.user.id };
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "site";
}

// ---------- Sites ----------

export async function createSite(formData: FormData) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("approved")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (!profile?.approved) {
    throw new Error("তোমার অ্যাকাউন্ট এখনো admin approve করেনি — approve হওয়া পর্যন্ত অপেক্ষা করো।");
  }

  const recipientName = String(formData.get("recipient_name") ?? "").trim() || "Your Person";
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const base = slugify(requestedSlug || recipientName);
  const templateId = String(formData.get("template_id") ?? "").trim() || null;

  // Ensure the slug is unique by appending a short suffix if needed.
  let slug = base;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase.from("sites").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const insertPayload: Record<string, unknown> = {
    owner_id: auth.user!.id,
    slug,
    recipient_name: recipientName,
  };

  if (templateId) {
    const { data: template } = await supabase.from("templates").select("*").eq("id", templateId).maybeSingle();
    if (template) {
      insertPayload.template_id = template.id;
      insertPayload.greeting_text = template.greeting_text;
      insertPayload.cake_title = template.cake_title;
      insertPayload.letter_title = template.letter_title;
      insertPayload.letter_content = template.letter_content;
      insertPayload.secret_button_label = template.secret_button_label;
    }
  }

  const { data: site, error } = await supabase
    .from("sites")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  redirect(`/dashboard/${site.id}`);
}

export async function deleteSite(siteId: string) {
  const { supabase } = await requireOwnedSite(siteId);
  const { error } = await supabase.from("sites").delete().eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateSlug(siteId: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const slug = slugify(String(formData.get("slug") ?? ""));

  const { data: existing } = await supabase.from("sites").select("id").eq("slug", slug).maybeSingle();
  if (existing && existing.id !== siteId) {
    throw new Error("এই লিংক (slug) আগে থেকেই ব্যবহার হচ্ছে, অন্য একটা বেছে নিন।");
  }

  const { error } = await supabase.from("sites").update({ slug, updated_at: new Date().toISOString() }).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}`);
}

export async function togglePublished(siteId: string, published: boolean) {
  const { supabase } = await requireOwnedSite(siteId);
  const { error } = await supabase.from("sites").update({ published, updated_at: new Date().toISOString() }).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}`);
}

// ---------- Settings ----------

export async function updateSettings(siteId: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);

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

  const { error } = await supabase.from("sites").update(payload).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}`);
  revalidatePath(`/dashboard/${siteId}/settings`);
}

export async function updateContactSettings(siteId: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);

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

  const { error } = await supabase.from("sites").update(payload).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}`);
  revalidatePath(`/dashboard/${siteId}/contact`);
}

export async function updateLetter(siteId: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const payload = {
    letter_title: String(formData.get("letter_title") ?? ""),
    letter_content: String(formData.get("letter_content") ?? ""),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("sites").update(payload).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}`);
  revalidatePath(`/dashboard/${siteId}/letter`);
}

export async function updateSecret(siteId: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const payload = {
    secret_photo_url: String(formData.get("secret_photo_url") ?? "") || null,
    secret_button_label: String(formData.get("secret_button_label") ?? ""),
    secret_button_link: String(formData.get("secret_button_link") ?? "") || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("sites").update(payload).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}`);
  revalidatePath(`/dashboard/${siteId}/secret`);
}

// ---------- Reasons ----------

export async function addReason(siteId: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const text = String(formData.get("text") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "💖").trim();
  if (!text) return;

  const { data: existing } = await supabase.from("reasons").select("order_index").eq("site_id", siteId);
  const nextOrder = (existing ?? []).reduce((max, r) => Math.max(max, r.order_index), -1) + 1;

  const { error } = await supabase.from("reasons").insert({ site_id: siteId, text, emoji, order_index: nextOrder });
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/reasons`);
}

export async function deleteReason(siteId: string, id: string) {
  const { supabase } = await requireOwnedSite(siteId);
  const { error } = await supabase.from("reasons").delete().eq("id", id).eq("site_id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/reasons`);
}

export async function updateReason(siteId: string, id: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const text = String(formData.get("text") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "💖").trim();

  const { error } = await supabase.from("reasons").update({ text, emoji }).eq("id", id).eq("site_id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/reasons`);
}

// ---------- Photos ----------

export async function addPhoto(siteId: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const image_url = String(formData.get("image_url") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  if (!image_url) return;

  const { data: existing } = await supabase.from("photos").select("order_index").eq("site_id", siteId);
  const nextOrder = (existing ?? []).reduce((max, r) => Math.max(max, r.order_index), -1) + 1;

  const { error } = await supabase.from("photos").insert({ site_id: siteId, image_url, title, caption, order_index: nextOrder });
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/photos`);
}

export async function deletePhoto(siteId: string, id: string) {
  const { supabase } = await requireOwnedSite(siteId);
  const { error } = await supabase.from("photos").delete().eq("id", id).eq("site_id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/photos`);
}

export async function updatePhoto(siteId: string, id: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();

  const { error } = await supabase.from("photos").update({ title, caption }).eq("id", id).eq("site_id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/photos`);
}

// ---------- Videos ----------

export async function addVideo(siteId: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const video_url = String(formData.get("video_url") ?? "").trim();
  const poster_url = String(formData.get("poster_url") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  if (!video_url) return;

  const { data: existing } = await supabase.from("videos").select("order_index").eq("site_id", siteId);
  const nextOrder = (existing ?? []).reduce((max, r) => Math.max(max, r.order_index), -1) + 1;

  const { error } = await supabase.from("videos").insert({ site_id: siteId, video_url, poster_url, title, order_index: nextOrder });
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/videos`);
}

export async function deleteVideo(siteId: string, id: string) {
  const { supabase } = await requireOwnedSite(siteId);
  const { error } = await supabase.from("videos").delete().eq("id", id).eq("site_id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/videos`);
}

export async function updateVideo(siteId: string, id: string, formData: FormData) {
  const { supabase } = await requireOwnedSite(siteId);
  const video_url = String(formData.get("video_url") ?? "").trim();
  const poster_url = String(formData.get("poster_url") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();

  const { error } = await supabase
    .from("videos")
    .update({ video_url, poster_url, title })
    .eq("id", id)
    .eq("site_id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/${siteId}/videos`);
}
