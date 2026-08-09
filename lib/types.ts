export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  approved: boolean;
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail_url: string | null;
  greeting_text: string;
  cake_title: string;
  letter_title: string;
  letter_content: string;
  secret_button_label: string;
  is_active: boolean;
  created_at: string;
}

export interface Site {
  id: string;
  owner_id: string;
  template_id: string | null;
  slug: string;
  recipient_name: string;
  age: number;
  birthday_month: number;
  birthday_day: number;
  birthday_hour: number;
  birthday_minute: number;
  greeting_text: string;
  cake_title: string;
  letter_title: string;
  letter_content: string;
  secret_photo_url: string | null;
  secret_button_label: string;
  secret_button_link: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  countdown_audio_url: string | null;
  birthday_audio_url: string | null;
  contact_email: string | null;
  whatsapp_url: string | null;
  emailjs_public_key: string | null;
  emailjs_service_id: string | null;
  emailjs_template_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Kept as an alias so the existing BirthdayExperience / form components
// (written against the old single-tenant "settings" shape) don't need to
// change — a Site already has every field SiteSettings had.
export type SiteSettings = Site;

export interface Reason {
  id: string;
  site_id: string;
  text: string;
  emoji: string;
  order_index: number;
  created_at: string;
}

export interface Photo {
  id: string;
  site_id: string;
  image_url: string;
  title: string;
  caption: string;
  order_index: number;
  created_at: string;
}

export interface VideoItem {
  id: string;
  site_id: string;
  video_url: string;
  poster_url: string | null;
  title: string;
  order_index: number;
  created_at: string;
}

export interface SiteData {
  settings: Site;
  reasons: Reason[];
  photos: Photo[];
  videos: VideoItem[];
}

// Site row + the owner's email, for the admin sites list.
export type SiteWithOwner = Site & { owner_email: string | null };
