import { getSiteData } from "@/lib/data";
import LetterForm from "./LetterForm";

export default async function LetterPage() {
  const { settings } = await getSiteData();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Letter</h1>
      <LetterForm settings={settings} />
    </div>
  );
}
