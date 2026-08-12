import Link from "next/link";
import { getSiteData } from "@/lib/data";

const CARDS = [
  { href: "/admin/settings", title: "Countdown & Greeting", desc: "নাম, বয়স, birthday date/time, greeting text" },
  { href: "/admin/reasons", title: "Reasons", desc: "\"reasons you're loved\" স্লাইডগুলো" },
  { href: "/admin/photos", title: "Photos", desc: "মেমোরি গ্যালারি" },
  { href: "/admin/videos", title: "Videos", desc: "স্পেশাল ভিডিও মেসেজ" },
  { href: "/admin/letter", title: "Letter", desc: "চিঠির টেক্সট" },
  { href: "/admin/secret", title: "Secret Photo", desc: "শেষের সিক্রেট ছবি ও বাটন" },
];

export default async function AdminDashboard() {
  const { settings, reasons, photos, videos } = await getSiteData();

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-fuchsia-700">Dashboard</h1>
      <p className="mb-8 text-stone-500">
        Site live for <span className="font-semibold text-fuchsia-600">{settings.recipient_name}</span> —{" "}
        {reasons.length} reasons, {photos.length} photos, {videos.length} videos.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
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
  );
}
