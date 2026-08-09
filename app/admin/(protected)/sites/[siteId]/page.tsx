import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteForAdmin } from "@/lib/adminData";
import AdminSiteForm from "./AdminSiteForm";

export default async function AdminSiteEditPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const data = await getSiteForAdmin(siteId);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/sites" className="mb-4 inline-block text-xs font-semibold text-stone-400 hover:text-fuchsia-600">
        ← সব Sites
      </Link>
      <h1 className="mb-1 font-display text-3xl text-fuchsia-700">{data.settings.recipient_name}</h1>
      <p className="mb-2 text-sm text-stone-500">
        Public link:{" "}
        <a href={`/s/${data.settings.slug}`} target="_blank" rel="noreferrer" className="font-semibold text-fuchsia-600 underline">
          /s/{data.settings.slug}
        </a>
      </p>
      <p className="mb-8">
        <Link
          href={`/dashboard/${siteId}`}
          className="inline-block rounded-full bg-fuchsia-100 px-4 py-2 text-sm font-semibold text-fuchsia-700 hover:bg-fuchsia-200"
        >
          পুরো Editor খোলো (name, countdown, greeting, reasons, photos, videos, letter, secret — সব) →
        </Link>
      </p>
      <AdminSiteForm site={data.settings} />
    </div>
  );
}
