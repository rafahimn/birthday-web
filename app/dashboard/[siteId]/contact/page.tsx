import { notFound } from "next/navigation";
import { getSiteForOwner } from "@/lib/data";
import ContactSettingsForm from "./ContactSettingsForm";

export default async function ContactPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-fuchsia-700">Contact</h1>
      <p className="mb-6 max-w-xl text-sm text-stone-500">
        সাইটের &ldquo;💌 Say Hi&rdquo; বাটনে ক্লিক করলে যা দেখা যায় — সবকিছু এখান থেকে বদলানো যাবে।
      </p>
      <ContactSettingsForm siteId={siteId} settings={data.settings} />
    </div>
  );
}
