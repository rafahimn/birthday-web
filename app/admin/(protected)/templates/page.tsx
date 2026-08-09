import { getAllTemplates } from "@/lib/adminData";
import TemplatesManager from "./TemplatesManager";

export default async function AdminTemplatesPage() {
  const templates = await getAllTemplates();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-display text-3xl text-fuchsia-700">Templates</h1>
      <p className="mb-8 text-sm text-stone-500">
        নতুন site বানানোর সময় member এখান থেকে template বেছে নিতে পারবে — শুধু active template গুলো দেখাবে।
      </p>
      <TemplatesManager templates={templates} />
    </div>
  );
}
