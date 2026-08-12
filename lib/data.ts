import { createClient } from "@/lib/supabase/server";
import type { SiteData, SiteSettings } from "@/lib/types";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  recipient_name: "Natu..",
  age: 18,
  birthday_month: 6,
  birthday_day: 6,
  birthday_hour: 21,
  birthday_minute: 30,
  greeting_text: "Hey You Know What! You're the most adorable human i ever met! 💖",
  cake_title: "Happy Birthday Sweety❤️🎂",
  letter_title: "A Letter for You Babiee 💌",
  letter_content: "Every laugh, every chat, and every moment we've shared has been truly special.💫",
  secret_photo_url: null,
  secret_button_label: "See Your Friend",
  secret_button_link: null,
  facebook_url: null,
  instagram_url: null,
  countdown_audio_url: null,
  birthday_audio_url: null,
  contact_email: null,
  whatsapp_url: null,
  emailjs_public_key: null,
  emailjs_service_id: null,
  emailjs_template_id: null,
  updated_at: new Date().toISOString(),
};

export async function getSiteData(): Promise<SiteData> {
  const supabase = await createClient();

  const [settingsRes, reasonsRes, photosRes, videosRes] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("reasons").select("*").order("order_index", { ascending: true }),
    supabase.from("photos").select("*").order("order_index", { ascending: true }),
    supabase.from("videos").select("*").order("order_index", { ascending: true }),
  ]);

  return {
    settings: (settingsRes.data as SiteSettings) ?? DEFAULT_SETTINGS,
    reasons: reasonsRes.data ?? [],
    photos: photosRes.data ?? [],
    videos: videosRes.data ?? [],
  };
}
