import Link from "next/link";
import { signup } from "@/lib/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; invite?: string }>;
}) {
  const { error, invite } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-violet-50 px-4">
      <form action={signup} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-display text-3xl text-fuchsia-700">Sign up</h1>
        <p className="mb-6 text-center text-sm text-stone-500">নিজের birthday surprise site বানানো শুরু করো</p>

        {invite && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">
            তুমি একটা invite link দিয়ে আসছো — account approve করার জন্য admin-এর অপেক্ষা করতে হবে না।
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {invite && <input type="hidden" name="invite" value={invite} />}

        <label className="mb-1 block text-sm font-medium text-stone-600">Email</label>
        <input type="email" name="email" required className="input mb-4" />

        <label className="mb-1 block text-sm font-medium text-stone-600">Password</label>
        <input type="password" name="password" required minLength={6} className="input mb-6" />

        <button type="submit" className="btn-primary w-full">Create account</button>

        <p className="mt-5 text-center text-sm text-stone-500">
          আগে থেকে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="font-semibold text-fuchsia-600 underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
