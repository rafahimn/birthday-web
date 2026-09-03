'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const googleErrors: Record<string, string> = {
  google_not_configured: 'Google Login is not configured yet.',
  google_invalid_state: 'Google Login security check failed. Please try again.',
  google_token_failed: 'Google Login could not be completed. Please try again.',
  google_profile_failed: 'Could not read your Google profile. Please try again.',
  google_email_not_verified: 'Your Google email is not verified.',
  google_login_failed: 'Google Login failed. Please try again.',
  auth_callback_failed: 'Authentication could not be completed. Please try again.',
  supabase_not_configured: 'Supabase authentication is not configured yet.',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  useEffect(() => {
    // Read the OAuth error only on the client. This avoids Next.js static
    // prerender requirements for useSearchParams() on the /login route.
    const code = new URLSearchParams(window.location.search).get('error');
    if (code) setErr(googleErrors[code] || 'Login failed. Please try again.');
  }, []);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || 'Login failed');
    router.push('/dashboard');
  }

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <div className="card p-7">
        <h1 className="text-3xl font-bold">Welcome back</h1>

        <a
          href="/api/auth/google"
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-3 font-medium text-zinc-900 transition hover:bg-zinc-100"
        >
          <span className="text-lg font-bold">G</span>
          Continue with Google
        </a>

        <div className="my-5 flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-white/10" />
          OR
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={go} className="space-y-4">
          <input
            placeholder="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button className="btn w-full" type="submit">Login</button>
        </form>

        <p className="mt-5 text-sm text-zinc-400">
          No account? <Link href="/signup" className="text-pink-400">Create one</Link>
          {' • '}
          <Link href="/forgot-password" className="text-pink-400">Forgot password</Link>
        </p>
      </div>
    </main>
  );
}
