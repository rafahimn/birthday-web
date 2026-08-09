import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteForOwner } from "@/lib/data";
import { logout } from "@/lib/actions";

export default async function SiteDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const data = await getSiteForOwner(siteId);
  if (!data) notFound();

  const NAV = [
    { href: `/dashboard/${siteId}`, label: "Overview" },
    { href: `/dashboard/${siteId}/settings`, label: "Countdown & Greeting" },
    { href: `/dashboard/${siteId}/contact`, label: "Contact" },
    { href: `/dashboard/${siteId}/reasons`, label: "Reasons" },
    { href: `/dashboard/${siteId}/photos`, label: "Photos" },
    { href: `/dashboard/${siteId}/videos`, label: "Videos" },
    { href: `/dashboard/${siteId}/letter`, label: "Letter" },
    { href: `/dashboard/${siteId}/secret`, label: "Secret Photo" },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-stone-200 bg-white p-4 md:w-64 md:border-b-0 md:border-r">
          <Link href="/dashboard" className="mb-1 block text-xs font-semibold text-stone-400 hover:text-fuchsia-600">
            ← সব Sites
          </Link>
          <h2 className="mb-6 truncate px-0 font-display text-2xl text-fuchsia-700">{data.settings.recipient_name}</h2>
          <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-fuchsia-50 hover:text-fuchsia-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="mt-6 px-2">
            <button className="text-sm font-medium text-stone-400 hover:text-red-500">Log out</button>
          </form>
        </aside>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
