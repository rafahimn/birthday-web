import { getSiteData } from "@/lib/data";
import ContactSettingsForm from "./ContactSettingsForm";

export default async function ContactPage() {
  const { settings } = await getSiteData();
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-fuchsia-700">Contact</h1>
      <p className="mb-6 max-w-xl text-sm text-stone-500">
        সাইটের &ldquo;💌 Say Hi&rdquo; বাটনে ক্লিক করলে যা দেখা যায় — Facebook/Instagram লিংক, ইমেইল,
        WhatsApp, আর contact form (EmailJS) — সবকিছু এখান থেকে বদলানো যাবে। কোনো কোড টাচ করতে হবে না।
      </p>
      <ContactSettingsForm settings={settings} />
    </div>
  );
}
