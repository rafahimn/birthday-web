import Link from "next/link";
import { login } from "@/lib/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { error, reset } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-violet-50 px-4">
      <form action={login} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-display text-3xl text-fuchsia-700">Log in</h1>
        <p className="mb-6 text-center text-sm text-stone-500">তোমার birthday site(গুলো) manage করো</p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {reset && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            পাসওয়ার্ড বদলানো হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগ ইন করো।
          </p>
        )}

        <label className="mb-1 block text-sm font-medium text-stone-600">Email</label>
        <input type="email" name="email" required className="input mb-4" />

        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-stone-600">Password</label>
          <Link href="/forgot-password" className="text-xs font-medium text-fuchsia-600 hover:underline">
            ভুলে গেছো?
          </Link>
        </div>
        <input type="password" name="password" required className="input mb-6" />

        <button type="submit" className="btn-primary w-full">Log in</button>

        <p className="mt-5 text-center text-sm text-stone-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-semibold text-fuchsia-600 underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
