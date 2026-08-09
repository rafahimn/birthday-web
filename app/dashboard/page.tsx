import Link from "next/link";
import Image from "next/image";
import { getUserSites, getProfile, getActiveTemplates } from "@/lib/data";
import { logout } from "@/lib/actions";
import { SITE_TITLE } from "@/lib/brand";
import CreateSiteForm from "./CreateSiteForm";

export default async function DashboardPage() {
  const profile = await getProfile();

  if (profile && !profile.approved) {
    const initial = (profile.full_name || profile.email || "?").trim().charAt(0).toUpperCase();
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full bg-fuchsia-100">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt="" fill className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-2xl text-fuchsia-500">
                {initial}
              </span>
            )}
          </div>
          <h1 className="mb-2 font-display text-2xl text-fuchsia-700">Approval-এর অপেক্ষায়</h1>
          <p className="mb-6 text-sm text-stone-500">
            তোমার অ্যাকাউন্ট এখনো admin approve করেনি। এর মধ্যেই profile-এ ছবি/নাম বসিয়ে রাখতে পারো — approve
            হলে এখান থেকেই site বানাতে পারবে।
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard/profile" className="text-sm font-semibold text-fuchsia-600 hover:underline">
              Profile
            </Link>
            <form action={logout}>
              <button className="text-sm font-medium text-stone-400 hover:text-red-500">Log out</button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  const [sites, templates] = await Promise.all([getUserSites(), getActiveTemplates()]);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-6 inline-block font-display text-xl text-fuchsia-700">
          {SITE_TITLE}
        </Link>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl text-fuchsia-700">তোমার Sites</h1>
          <div className="flex items-center gap-4">
            {profile?.is_admin && (
              <Link href="/admin" className="text-sm font-semibold text-fuchsia-600 hover:underline">
                Admin Panel
              </Link>
            )}
            <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm font-semibold text-fuchsia-600 hover:underline">
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-fuchsia-100">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="" fill className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-bold text-fuchsia-500">
                    {(profile?.full_name || profile?.email || "?").trim().charAt(0).toUpperCase()}
                  </span>
                )}
              </span>
              Profile
            </Link>
            <form action={logout}>
              <button className="text-sm font-medium text-stone-400 hover:text-red-500">Log out</button>
            </form>
          </div>
        </div>

        <div className="mb-8">
          <CreateSiteForm templates={templates} />
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
