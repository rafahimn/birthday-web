import Link from "next/link";
import { forgotPassword } from "@/lib/actions";
import { SITE_TITLE } from "@/lib/brand";
import SubmitButton from "@/components/SubmitButton";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-violet-50 px-4">
      <Link href="/" className="mb-6 font-display text-2xl text-fuchsia-700">
        {SITE_TITLE}
      </Link>
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-display text-3xl text-fuchsia-700">পাসওয়ার্ড ভুলে গেছো?</h1>
        <p className="mb-6 text-center text-sm text-stone-500">
          তোমার account-এর email দাও, reset link পাঠিয়ে দিচ্ছি।
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {sent ? (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            যদি এই email দিয়ে কোনো account থাকে, একটা reset link পাঠানো হয়েছে। Inbox (এবং spam folder) চেক করো।
          </p>
        ) : (
          <form action={forgotPassword}>
            <label className="mb-1 block text-sm font-medium text-stone-600">Email</label>
            <input type="email" name="email" required className="input mb-6" />
            <SubmitButton pendingText="Sending...">Reset link পাঠাও</SubmitButton>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-stone-500">
          মনে পড়ে গেছে?{" "}
          <Link href="/login" className="font-semibold text-fuchsia-600 underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
