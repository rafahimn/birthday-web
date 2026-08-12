import { getSiteData } from "@/lib/data";
import SecretForm from "./SecretForm";

export default async function SecretPage() {
  const { settings } = await getSiteData();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Secret Photo</h1>
      <SecretForm settings={settings} />
    </div>
  );
}
