import BirthdayExperience from "../BirthdayExperience";
import { getDemoData } from "@/lib/demoData";

export default function DemoPage() {
  return <BirthdayExperience data={getDemoData()} />;
}
