import { notFound } from "next/navigation";
import { getSiteForOwner } from "@/lib/data";
import VideosManager from "./VideosManager";

export default async function VideosPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Videos</h1>
      <VideosManager siteId={siteId} videos={data.videos} />
    </div>
  );
}
