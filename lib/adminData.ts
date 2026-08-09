import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Template, SiteWithOwner, SiteData } from "@/lib/types";

/** Redirects to /admin/login unless the current user is a logged-in admin. Returns the profile. */
export async function requireAdmin(): Promise<Profile> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
  if (!profile?.is_admin) redirect("/admin/login?error=" + encodeURIComponent("এই অ্যাকাউন্ট admin না।"));

  return profile as Profile;
}

/** All members (profiles), newest first — for the /admin/members approval queue. */
export async function getAllMembers(): Promise<Profile[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Every site across every member, with the owner's email attached — for /admin/sites. */
export async function getAllSites(): Promise<SiteWithOwner[]> {
  await requireAdmin();
  const supabase = await createClient();

  const [sitesRes, profilesRes] = await Promise.all([
    supabase.from("sites").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, email"),
  ]);
  if (sitesRes.error) throw new Error(sitesRes.error.message);

  const emailById = new Map((profilesRes.data ?? []).map((p) => [p.id, p.email]));
  return (sitesRes.data ?? []).map((s) => ({ ...s, owner_email: emailById.get(s.owner_id) ?? null }));
}

/** One site (any owner) + its reasons/photos/videos, for admin editing. */
export async function getSiteForAdmin(siteId: string): Promise<SiteData | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: site } = await supabase.from("sites").select("*").eq("id", siteId).maybeSingle();
  if (!site) return null;

  const [reasonsRes, photosRes, videosRes] = await Promise.all([
    supabase.from("reasons").select("*").eq("site_id", siteId).order("order_index", { ascending: true }),
    supabase.from("photos").select("*").eq("site_id", siteId).order("order_index", { ascending: true }),
    supabase.from("videos").select("*").eq("site_id", siteId).order("order_index", { ascending: true }),
  ]);

  return {
    settings: site,
    reasons: reasonsRes.data ?? [],
    photos: photosRes.data ?? [],
    videos: videosRes.data ?? [],
  };
}

/** All templates (active + inactive) — for /admin/templates. */
export async function getAllTemplates(): Promise<Template[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("templates").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
