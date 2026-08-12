import { login } from "@/lib/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-violet-50 px-4">
      <form
        action={login}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-1 text-center font-display text-3xl text-fuchsia-700">
          Admin Login
        </h1>
        <p className="mb-6 text-center text-sm text-stone-500">
          Birthday Surprise Site
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <label className="mb-1 block text-sm font-medium text-stone-600">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mb-4 w-full rounded-xl border border-stone-200 px-4 py-2 outline-none focus:border-fuchsia-400"
        />

        <label className="mb-1 block text-sm font-medium text-stone-600">Password</label>
        <input
          type="password"
          name="password"
          required
          className="mb-6 w-full rounded-xl border border-stone-200 px-4 py-2 outline-none focus:border-fuchsia-400"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
