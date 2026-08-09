import { notFound } from "next/navigation";
import { getSiteForOwner } from "@/lib/data";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Countdown & Greeting</h1>
      <SettingsForm siteId={siteId} settings={data.settings} />
    </div>
  );
}
