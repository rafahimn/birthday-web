import { getSiteData } from "@/lib/data";
import BirthdayExperience from "./BirthdayExperience";

export const revalidate = 0;

export default async function Home() {
  const data = await getSiteData();
  return <BirthdayExperience data={data} />;
}
