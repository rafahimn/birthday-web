import { getSiteData } from "@/lib/data";
import PhotosManager from "./PhotosManager";

export default async function PhotosPage() {
  const { photos } = await getSiteData();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Photos</h1>
      <PhotosManager photos={photos} />
    </div>
  );
}
