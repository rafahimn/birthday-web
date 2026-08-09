import { resetPassword } from "@/lib/actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-violet-50 px-4">
      <form action={resetPassword} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-display text-3xl text-fuchsia-700">নতুন পাসওয়ার্ড</h1>
        <p className="mb-6 text-center text-sm text-stone-500">তোমার account-এর জন্য একটা নতুন পাসওয়ার্ড সেট করো</p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <label className="mb-1 block text-sm font-medium text-stone-600">নতুন পাসওয়ার্ড</label>
        <input type="password" name="password" required minLength={6} className="input mb-4" />

        <label className="mb-1 block text-sm font-medium text-stone-600">আবার লেখো</label>
        <input type="password" name="confirm_password" required minLength={6} className="input mb-6" />

        <button type="submit" className="btn-primary w-full">পাসওয়ার্ড বদলাও</button>
      </form>
    </main>
  );
}
