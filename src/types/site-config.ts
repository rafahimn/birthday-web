// Every field here maps directly to something that was hardcoded in the
// original birthday-site-fixed.html. Add a new field here + wire it into
// templateEngine.ts whenever you want to expose another editable part.

export interface Reason {
  text: string;
  emoji: string;
  gif?: string;
}

export interface Photo {
  url: string;
  title: string;
  caption: string;
}

export interface VideoCard {
  title: string;
  url: string; // mp4 url
  poster?: string;
}

export interface SiteConfig {
  // Identity / recipient
  recipientName: string; // used in ?name= fallback + CONFIG.name
  pageTitle: string; // <title>
  age: number; // number of candles

  // The target date/time the countdown counts down to
  month: number; // 0-11
  day: number;
  hour: number; // 0-23
  minute: number;

  // Text content
  greetingHeading: string; // "Happy Birthday X"
  greetingTyped: string; // typed-out line under the heading
  reasonsHeading: string;
  reasons: Reason[];
  letterHeading: string;
  letterParagraphs: string[];
  photosHeading: string;
  photosSubtext: string;
  photos: Photo[];
  videosHeading: string;
  videos: VideoCard[];
  secretPhotoUrl: string;
  secretButtonLabel: string;
  secretButtonLink: string; // e.g. instagram profile

  // Media
  countdownAudioUrl: string;
  birthdayAudioUrl: string;
  bgVideoUrl: string;

  // Branding / theme
  primaryColor: string; // e.g. #ff69b4
  secondaryColor: string; // e.g. #9370db
  accentColor: string; // e.g. gold

  // Contact / socials (shown on the floating contact form)
  facebookUrl?: string;
  instagramUrl?: string;
  emailjsServiceId?: string;
  emailjsTemplateId?: string;
  emailjsPublicKey?: string;
}

export const defaultSiteConfig: SiteConfig = {
  recipientName: "Sweetheart",
  pageTitle: "A Birthday Surprise 💫",
  age: 18,
  month: 0,
  day: 1,
  hour: 0,
  minute: 0,
  greetingHeading: "Happy Birthday ❤️🎂💫",
  greetingTyped: "Hey You Know What! You're the most adorable human I ever met! 💖",
  reasonsHeading: "Happy Birthday 💖",
  reasons: [
    { text: "You're such a kind and wonderful person.", emoji: "🌟" },
    { text: "May your day be filled with love, laughter, and endless joy.", emoji: "💗" },
    { text: "Wishing you success, happiness, and everything your heart desires.", emoji: "💕" },
    { text: "Stay the amazing person you are — have the happiest year ahead! 🥳", emoji: "🌟" }
  ],
  letterHeading: "A Letter for You 💌",
  letterParagraphs: [
    "Every laugh, every chat, and every moment we've shared has been truly special. 💫",
    "I'm so grateful for the bond we have.",
    "On your birthday, I wish for endless happiness, love, and success to come your way. 🌸",
    "Until we meet again 💝"
  ],
  photosHeading: "Our Beautiful Moments Together",
  photosSubtext: "Every moment spent with you has been magical.",
  photos: [],
  videosHeading: "A Special Video Message",
  videos: [],
  secretPhotoUrl: "",
  secretButtonLabel: "See more",
  secretButtonLink: "#",
  countdownAudioUrl: "",
  birthdayAudioUrl: "",
  bgVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-candles-in-the-dark-1327-large.mp4",
  primaryColor: "#ff69b4",
  secondaryColor: "#9370db",
  accentColor: "#ffd700",
  facebookUrl: "",
  instagramUrl: "",
  emailjsServiceId: "",
  emailjsTemplateId: "",
  emailjsPublicKey: ""
};
