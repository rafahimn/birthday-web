import { notFound } from "next/navigation";
import { getSiteForOwner } from "@/lib/data";
import SecretForm from "./SecretForm";

export default async function SecretPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-fuchsia-700">Secret Photo</h1>
      <SecretForm siteId={siteId} settings={data.settings} />
    </div>
  );
}
