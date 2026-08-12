import { getSiteData } from "@/lib/data";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const { settings } = await getSiteData();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Countdown & Greeting</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
