import { getSiteData } from "@/lib/data";
import ReasonsManager from "./ReasonsManager";

export default async function ReasonsPage() {
  const { reasons } = await getSiteData();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Reasons</h1>
      <ReasonsManager reasons={reasons} />
    </div>
  );
}
