import { notFound } from "next/navigation";
import { getSiteForOwner } from "@/lib/data";
import LetterForm from "./LetterForm";

export default async function LetterPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Letter</h1>
      <LetterForm siteId={siteId} settings={data.settings} />
    </div>
  );
}
