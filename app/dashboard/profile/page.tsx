import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data";
import { logout } from "@/lib/actions";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl text-fuchsia-700">Profile</h1>
          <Link href="/dashboard" className="text-sm font-semibold text-fuchsia-600 hover:underline">
            ← Dashboard
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Email</p>
          <p className="mb-5 text-stone-800">{profile.email}</p>

          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Account Status</p>
          {profile.approved ? (
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              Approved
            </span>
          ) : (
            <div>
              <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                Pending Admin Approval
              </span>
              <p className="mt-3 text-sm text-stone-500">
                তোমার অ্যাকাউন্ট এখনো admin approve করেনি। Approve না হওয়া পর্যন্ত site বানানো বা এডিট করা যাবে না —
                approve হলেই এখান থেকে দেখতে পারবে।
              </p>
            </div>
          )}

          {profile.is_admin && (
            <p className="mt-5">
              <Link href="/admin" className="text-sm font-semibold text-fuchsia-600 hover:underline">
                Admin Panel →
              </Link>
            </p>
          )}
        </div>

        <form action={logout} className="mt-6 text-center">
          <button className="text-sm font-medium text-stone-400 hover:text-red-500">Log out</button>
        </form>
      </div>
    </main>
  );
}
