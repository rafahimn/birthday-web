import { adminLogin } from "@/lib/adminActions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-900 to-fuchsia-950 px-4">
      <form action={adminLogin} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-display text-3xl text-fuchsia-700">Admin Login</h1>
        <p className="mb-6 text-center text-sm text-stone-500">শুধুমাত্র admin অ্যাকাউন্টের জন্য</p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <label className="mb-1 block text-sm font-medium text-stone-600">Email</label>
        <input type="email" name="email" required className="input mb-4" />

        <label className="mb-1 block text-sm font-medium text-stone-600">Password</label>
        <input type="password" name="password" required className="input mb-6" />

        <button type="submit" className="btn-primary w-full">Log in</button>
      </form>
    </main>
  );
}
