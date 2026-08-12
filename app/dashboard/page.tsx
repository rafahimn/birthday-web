import Link from "next/link";
import { getUserSites } from "@/lib/data";
import { logout } from "@/lib/actions";
import CreateSiteForm from "./CreateSiteForm";

export default async function DashboardPage() {
  const sites = await getUserSites();

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl text-fuchsia-700">তোমার Sites</h1>
          <form action={logout}>
            <button className="text-sm font-medium text-stone-400 hover:text-red-500">Log out</button>
          </form>
        </div>

        <div className="mb-8">
          <CreateSiteForm />
        </div>

        {sites.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-stone-500 shadow-sm">
            এখনো কোনো site বানাওনি। উপরের বাটনে ক্লিক করে প্রথমটা বানাও।
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sites.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/${s.id}`}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="font-semibold text-fuchsia-700">{s.recipient_name}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      s.published ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {s.published ? "Live" : "Draft"}
                  </span>
                </div>
                <p className="truncate text-sm text-stone-500">/s/{s.slug}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
