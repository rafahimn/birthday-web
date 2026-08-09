import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data";
import { logout, updateOwnPassword, updateOwnEmail } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; updated?: string; email_pending?: string }>;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const { error, updated, email_pending } = await searchParams;

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl text-fuchsia-700">Profile</h1>
          <Link href="/dashboard" className="text-sm font-semibold text-fuchsia-600 hover:underline">
            ← Dashboard
          </Link>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {updated && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Password updated.
          </p>
        )}
        {email_pending && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Check your new inbox — confirm the change there before it takes effect.
          </p>
        )}

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
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
                Your account hasn&apos;t been approved by an admin yet. You can&apos;t create or edit a site until
                it&apos;s approved — you&apos;ll be able to from here as soon as it is.
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

        <form action={updateOwnEmail} className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-display text-xl text-fuchsia-700">Email</h2>
          <label className="mb-1 block text-sm font-medium text-stone-600">Login email</label>
          <input type="email" name="email" defaultValue={profile.email} required className="input mb-4" />
          <SubmitButton className="rounded-full bg-fuchsia-100 px-4 py-2 text-sm font-semibold text-fuchsia-700 hover:bg-fuchsia-200" pendingText="Saving...">
            Update email
          </SubmitButton>
        </form>

        <form action={updateOwnPassword} className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-display text-xl text-fuchsia-700">Change password</h2>
          <label className="mb-1 block text-sm font-medium text-stone-600">New password</label>
          <input type="password" name="password" required minLength={6} className="input mb-4" />
          <label className="mb-1 block text-sm font-medium text-stone-600">Confirm new password</label>
          <input type="password" name="confirm_password" required minLength={6} className="input mb-4" />
          <SubmitButton className="rounded-full bg-fuchsia-100 px-4 py-2 text-sm font-semibold text-fuchsia-700 hover:bg-fuchsia-200" pendingText="Saving...">
            Update password
          </SubmitButton>
        </form>

        <form action={logout} className="text-center">
          <button className="text-sm font-medium text-stone-400 hover:text-red-500">Log out</button>
        </form>
      </div>
    </main>
  );
}
