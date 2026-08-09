import type { SiteData } from "@/lib/types";

// Static, no-database demo shown on the homepage so visitors can see the
// real template before signing up. Countdown target is always "in a few
// seconds" relative to page load so the demo reaches the greeting screen
// quickly instead of showing a multi-day countdown.
export function getDemoData(): SiteData {
  const now = new Date();
  const soon = new Date(now.getTime() + 15000);

  return {
    settings: {
      id: "demo",
      owner_id: "demo",
      template_id: null,
      slug: "demo",
      recipient_name: "Demo",
      age: 20,
      birthday_month: soon.getMonth(),
      birthday_day: soon.getDate(),
      birthday_hour: soon.getHours(),
      birthday_minute: soon.getMinutes(),
      greeting_text: "Hey! This is exactly what your person will see 💖",
      cake_title: "Happy Birthday! 🎂",
      letter_title: "A Letter for You 💌",
      letter_content:
        "This whole page — the countdown, the cake, the reasons, the photos, the letter — is yours to fill in with your own person's name, dates, photos, and words.\n\nSign up and build your own in a few minutes.",
      secret_photo_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=60",
      secret_button_label: "Try it yourself",
      secret_button_link: "/signup",
      facebook_url: null,
      instagram_url: null,
      countdown_audio_url: null,
      birthday_audio_url: null,
      contact_email: null,
      whatsapp_url: null,
      emailjs_public_key: null,
      emailjs_service_id: null,
      emailjs_template_id: null,
      published: true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    reasons: [
      { id: "d1", site_id: "demo", text: "Add as many reasons as you like, each with its own emoji.", emoji: "🌟", order_index: 0, created_at: now.toISOString() },
      { id: "d2", site_id: "demo", text: "They show up one at a time, like a little story.", emoji: "💗", order_index: 1, created_at: now.toISOString() },
    ],
    photos: [
      { id: "p1", site_id: "demo", image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=60", title: "Add your own photos", caption: "Each photo gets a title and caption.", order_index: 0, created_at: now.toISOString() },
      { id: "p2", site_id: "demo", image_url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=60", title: "Upload or paste a link", caption: "Cloudinary upload button is built in.", order_index: 1, created_at: now.toISOString() },
    ],
    videos: [],
  };
}
