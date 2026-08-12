import { SiteConfig } from "@/types/site-config";

// Generic placeholder content so anyone visiting the homepage can see the
// template in action, without using anyone's real personal photos.
export const demoConfig: SiteConfig = {
  recipientName: "Alex",
  pageTitle: "A Birthday Surprise 💫",
  age: 12,
  month: new Date().getMonth(),
  day: new Date().getDate(),
  hour: 0,
  minute: 0,
  greetingHeading: "Happy Birthday Alex! ❤️🎂💫",
  greetingTyped: "This is just a sample — sign up to make your own with your own photos, videos and message!",
  reasonsHeading: "A Few Reasons You're Amazing 💖",
  reasons: [
    { text: "Your kindness makes every room brighter.", emoji: "🌟" },
    { text: "May this year bring you endless laughter and love.", emoji: "💗" },
    { text: "Wishing you success in everything you dream of.", emoji: "💕" },
    { text: "Stay exactly as wonderful as you are — happiest year ahead! 🥳", emoji: "🌟" }
  ],
  letterHeading: "A Letter for You 💌",
  letterParagraphs: [
    "Every memory we've made together has been special. 💫",
    "This is a demo letter — your version can say anything you want.",
    "Wishing you endless happiness, love, and success. 🌸",
    "Until we meet again 💝"
  ],
  photosHeading: "Beautiful Moments (sample photos)",
  photosSubtext: "This is what your photo gallery could look like.",
  photos: [
    { url: "https://picsum.photos/seed/birthday1/600/400", title: "Sample Memory 1", caption: "Your own caption goes here." },
    { url: "https://picsum.photos/seed/birthday2/600/400", title: "Sample Memory 2", caption: "Add as many photos as you like." },
    { url: "https://picsum.photos/seed/birthday3/600/400", title: "Sample Memory 3", caption: "Upload or paste any image URL." }
  ],
  videosHeading: "A Special Video Message (sample)",
  videos: [],
  secretPhotoUrl: "https://picsum.photos/seed/birthdaysecret/600/500",
  secretButtonLabel: "This could link anywhere",
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
