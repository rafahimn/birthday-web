import Link from "next/link";
import { getAllSites } from "@/lib/adminData";

export default async function AdminSitesPage() {
  const sites = await getAllSites();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-display text-3xl text-fuchsia-700">সব Sites</h1>
      <p className="mb-8 text-sm text-stone-500">যেকোনো member-এর site এখান থেকে দেখো, contact info বদলাও, publish/unpublish করো।</p>

      {sites.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-stone-500 shadow-sm">এখনো কোনো site নেই।</p>
      ) : (
        <div className="space-y-3">
          {sites.map((s) => (
            <Link
              key={s.id}
              href={`/admin/sites/${s.id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-fuchsia-700">{s.recipient_name}</p>
                <p className="text-sm text-stone-500">/s/{s.slug} · owner: {s.owner_email ?? "unknown"}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  s.published ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                }`}
              >
                {s.published ? "Live" : "Draft"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
