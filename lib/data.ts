import { createClient } from "@/lib/supabase/server";
import type { Site, SiteData, Profile, Template } from "@/lib/types";

/** Current logged-in user's profile row (approval + admin role). Null if logged out. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
  return (data as Profile) ?? null;
}

/** Active templates a member can pick from when creating a new site. */
export async function getActiveTemplates(): Promise<Template[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** All sites owned by the currently logged-in member (dashboard list). */
export async function getUserSites(): Promise<Site[]> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("owner_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * A single site + its reasons/photos/videos, for the owner's dashboard
 * editor. Returns null if the site doesn't exist OR the current user
 * doesn't own it (checked explicitly, on top of RLS, so a logged-in
 * user can never see another member's editor — RLS's public-read-if-
 * published policy is for the /s/[slug] page, not this one).
 */
export async function getSiteForOwner(siteId: string): Promise<SiteData | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: site } = await supabase.from("sites").select("*").eq("id", siteId).maybeSingle();
  if (!site || site.owner_id !== auth.user.id) return null;

  const [reasonsRes, photosRes, videosRes] = await Promise.all([
    supabase.from("reasons").select("*").eq("site_id", siteId).order("order_index", { ascending: true }),
    supabase.from("photos").select("*").eq("site_id", siteId).order("order_index", { ascending: true }),
    supabase.from("videos").select("*").eq("site_id", siteId).order("order_index", { ascending: true }),
  ]);

  return {
    settings: site as Site,
    reasons: reasonsRes.data ?? [],
    photos: photosRes.data ?? [],
    videos: videosRes.data ?? [],
  };
}

/** Public lookup by slug, for the shareable /s/[slug] page. Unpublished -> null. */
export async function getSiteBySlug(slug: string): Promise<SiteData | null> {
  const supabase = await createClient();

  const { data: site } = await supabase
    .from("sites")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!site) return null;

  const [reasonsRes, photosRes, videosRes] = await Promise.all([
    supabase.from("reasons").select("*").eq("site_id", site.id).order("order_index", { ascending: true }),
    supabase.from("photos").select("*").eq("site_id", site.id).order("order_index", { ascending: true }),
    supabase.from("videos").select("*").eq("site_id", site.id).order("order_index", { ascending: true }),
  ]);

  return {
    settings: site as Site,
    reasons: reasonsRes.data ?? [],
    photos: photosRes.data ?? [],
    videos: videosRes.data ?? [],
  };
}
