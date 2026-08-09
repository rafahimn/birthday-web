import { notFound } from "next/navigation";
import { getSiteForOwner } from "@/lib/data";
import PhotosManager from "./PhotosManager";

export default async function PhotosPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Photos</h1>
      <PhotosManager siteId={siteId} photos={data.photos} />
    </div>
  );
}
