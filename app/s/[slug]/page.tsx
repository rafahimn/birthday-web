import { notFound } from "next/navigation";
import { getSiteBySlug } from "@/lib/data";
import BirthdayExperience from "../../BirthdayExperience";

export const revalidate = 0;

export default async function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getSiteBySlug(slug);
  if (!data) notFound();

  return <BirthdayExperience data={data} />;
}
