import { getSiteData } from "@/lib/data";
import VideosManager from "./VideosManager";

export default async function VideosPage() {
  const { videos } = await getSiteData();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Videos</h1>
      <VideosManager videos={videos} />
    </div>
  );
}
