import { notFound } from "next/navigation";
import { getSiteForOwner } from "@/lib/data";
import ReasonsManager from "./ReasonsManager";

export default async function ReasonsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Reasons</h1>
      <ReasonsManager siteId={siteId} reasons={data.reasons} />
    </div>
  );
}
