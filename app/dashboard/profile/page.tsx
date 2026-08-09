import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data";
import { logout, updateOwnPassword, updateOwnEmail } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; updated?: string; email_pending?: string }>;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const { error, updated, email_pending } = await searchParams;
  const initial = (profile.full_name || profile.email || "?").trim().charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl text-fuchsia-700">Profile</h1>
          <Link href="/dashboard" className="text-sm font-semibold text-fuchsia-600 hover:underline">
            ← Dashboard
          </Link>
        </div>

        {/* Facebook-style header: cover strip + big avatar + name */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-fuchsia-400 to-violet-400" />
          <div className="flex flex-col items-center px-6 pb-6 text-center">
            <div className="relative -mt-12 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-fuchsia-100 shadow-md">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt="Profile picture" fill className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-display text-4xl text-fuchsia-500">
                  {initial}
                </span>
              )}
            </div>
            <p className="mt-3 font-display text-xl text-stone-800">{profile.full_name || profile.email}</p>
            <p className="text-sm text-stone-400">{profile.email}</p>
            {profile.bio && <p className="mt-2 max-w-sm text-sm text-stone-500">{profile.bio}</p>}
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {updated === "profile" && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Profile updated.
          </p>
        )}
        {updated === "1" && (
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
                You can see and set up your profile right away — you just can&apos;t create or edit a site until
                an admin approves your account. That can take a little while; feel free to fill in your photo and
                name in the meantime.
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

        <div className="mb-6">
          <ProfileForm profile={profile} />
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
