"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---------- Admin auth ----------

/** Same Supabase auth as the member login, but only lets an is_admin profile through. */
export async function adminLogin(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", data.user.id).maybeSingle();
  if (!profile?.is_admin) {
    await supabase.auth.signOut();
    redirect(`/admin/login?error=${encodeURIComponent("এই অ্যাকাউন্ট admin না।")}`);
  }

  redirect("/admin/members");
}

export async function adminLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function requireAdminSupabase() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not signed in");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", auth.user.id).maybeSingle();
  if (!profile?.is_admin) throw new Error("Admin access দরকার");

  return { supabase, userId: auth.user.id };
}

// ---------- Members ----------

export async function approveMember(userId: string) {
  const { supabase } = await requireAdminSupabase();
  const { error } = await supabase.from("profiles").update({ approved: true }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/members");
}

export async function unapproveMember(userId: string) {
  const { supabase } = await requireAdminSupabase();
  const { error } = await supabase.from("profiles").update({ approved: false }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/members");
}

export async function setAdminRole(userId: string, isAdmin: boolean) {
  const { supabase, userId: selfId } = await requireAdminSupabase();
  if (userId === selfId && !isAdmin) {
    throw new Error("নিজের admin access নিজে remove করা যাবে না।");
  }
  const { error } = await supabase.from("profiles").update({ is_admin: isAdmin }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/members");
}

// ---------- Invite link ----------

/** Rotates the shared invite token, so any old copied link stops working. */
export async function regenerateInviteLink() {
  const { supabase } = await requireAdminSupabase();
  const newToken = crypto.randomUUID().replace(/-/g, "").slice(0, 18);
  const { error } = await supabase.from("app_settings").update({ invite_token: newToken }).eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/members");
}

// ---------- Sites (admin can touch any site) ----------

export async function adminUpdateSiteContact(siteId: string, formData: FormData) {
  const { supabase } = await requireAdminSupabase();
  const payload = {
    recipient_name: String(formData.get("recipient_name") ?? "").trim() || "Your Person",
    facebook_url: String(formData.get("facebook_url") ?? "") || null,
    instagram_url: String(formData.get("instagram_url") ?? "") || null,
    contact_email: String(formData.get("contact_email") ?? "") || null,
    whatsapp_url: String(formData.get("whatsapp_url") ?? "") || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("sites").update(payload).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/sites");
  revalidatePath(`/admin/sites/${siteId}`);
}

export async function adminTogglePublished(siteId: string, published: boolean) {
  const { supabase } = await requireAdminSupabase();
  const { error } = await supabase.from("sites").update({ published, updated_at: new Date().toISOString() }).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/sites");
  revalidatePath(`/admin/sites/${siteId}`);
}

export async function adminDeleteSite(siteId: string) {
  const { supabase } = await requireAdminSupabase();
  const { error } = await supabase.from("sites").delete().eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/sites");
  redirect("/admin/sites");
}

// ---------- Templates ----------

export async function createTemplate(formData: FormData) {
  const { supabase } = await requireAdminSupabase();
  const payload = {
    name: String(formData.get("name") ?? "").trim() || "Untitled template",
    thumbnail_url: String(formData.get("thumbnail_url") ?? "") || null,
    greeting_text: String(formData.get("greeting_text") ?? "") || "Happy Birthday! You mean the world to me 💖",
    cake_title: String(formData.get("cake_title") ?? "") || "Happy Birthday! 🎂",
    letter_title: String(formData.get("letter_title") ?? "") || "A Letter for You 💌",
    letter_content: String(formData.get("letter_content") ?? "") || "Write something special here...",
    secret_button_label: String(formData.get("secret_button_label") ?? "") || "See more",
  };
  const { error } = await supabase.from("templates").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/templates");
}

export async function updateTemplate(id: string, formData: FormData) {
  const { supabase } = await requireAdminSupabase();
  const payload = {
    name: String(formData.get("name") ?? "").trim() || "Untitled template",
    thumbnail_url: String(formData.get("thumbnail_url") ?? "") || null,
    greeting_text: String(formData.get("greeting_text") ?? ""),
    cake_title: String(formData.get("cake_title") ?? ""),
    letter_title: String(formData.get("letter_title") ?? ""),
    letter_content: String(formData.get("letter_content") ?? ""),
    secret_button_label: String(formData.get("secret_button_label") ?? ""),
  };
  const { error } = await supabase.from("templates").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/templates");
}

export async function toggleTemplateActive(id: string, isActive: boolean) {
  const { supabase } = await requireAdminSupabase();
  const { error } = await supabase.from("templates").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/templates");
}

export async function deleteTemplate(id: string) {
  const { supabase } = await requireAdminSupabase();
  const { error } = await supabase.from("templates").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/templates");
}
