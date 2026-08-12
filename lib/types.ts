export interface SiteSettings {
  id: number;
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
  updated_at: string;
}

export interface Reason {
  id: string;
  text: string;
  emoji: string;
  order_index: number;
  created_at: string;
}

export interface Photo {
  id: string;
  image_url: string;
  title: string;
  caption: string;
  order_index: number;
  created_at: string;
}

export interface VideoItem {
  id: string;
  video_url: string;
  poster_url: string | null;
  title: string;
  order_index: number;
  created_at: string;
}

export interface SiteData {
  settings: SiteSettings;
  reasons: Reason[];
  photos: Photo[];
  videos: VideoItem[];
}
