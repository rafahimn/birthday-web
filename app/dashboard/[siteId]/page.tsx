import Link from "next/link";
import { getSiteForOwner } from "@/lib/data";
import { notFound } from "next/navigation";
import PublishControls from "./PublishControls";

const CARDS = (siteId: string) => [
  { href: `/dashboard/${siteId}/settings`, title: "Countdown & Greeting", desc: "নাম, বয়স, birthday date/time, greeting text" },
  { href: `/dashboard/${siteId}/reasons`, title: "Reasons", desc: '"reasons you\'re loved" স্লাইডগুলো' },
  { href: `/dashboard/${siteId}/photos`, title: "Photos", desc: "মেমোরি গ্যালারি" },
  { href: `/dashboard/${siteId}/videos`, title: "Videos", desc: "স্পেশাল ভিডিও মেসেজ" },
  { href: `/dashboard/${siteId}/letter`, title: "Letter", desc: "চিঠির টেক্সট" },
  { href: `/dashboard/${siteId}/secret`, title: "Secret Photo", desc: "শেষের সিক্রেট ছবি ও বাটন" },
];

export default async function SiteOverviewPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  const { settings, reasons, photos, videos } = data;

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-fuchsia-700">Overview</h1>
      <p className="mb-8 text-stone-500">
        <span className="font-semibold text-fuchsia-600">{settings.recipient_name}</span> — {reasons.length} reasons,{" "}
        {photos.length} photos, {videos.length} videos.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <PublishControls site={settings} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CARDS(siteId).map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="mb-1 font-semibold text-fuchsia-700">{c.title}</h2>
                <p className="text-sm text-stone-500">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-stone-600">Live preview</p>
          <div className="overflow-hidden rounded-3xl border-4 border-white shadow-lg">
            <iframe key={siteId} src={`/s/${settings.slug}`} title="Preview" className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
