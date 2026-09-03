'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (password.length < 8) return setErr('Password must be at least 8 characters.');
    if (password !== confirm) return setErr('Passwords do not match.');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/reset-confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const j = await r.json();
      if (!r.ok) return setErr(j.error || 'Could not reset your password.');
      setOk(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <div className="card p-7">
        <h1 className="text-3xl font-bold">Choose a new password</h1>
        {ok ? (
          <p className="mt-5 text-emerald-400">Password updated. Taking you to your dashboard...</p>
        ) : (
          <form onSubmit={go} className="mt-5 space-y-4">
            <input
              placeholder="New password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              placeholder="Confirm new password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input type="checkbox" className="w-auto" checked={show} onChange={e => setShow(e.target.checked)} />
              Show passwords
            </label>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button className="btn w-full" type="submit" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
        {!ok && (
          <p className="mt-5 text-sm text-zinc-400">
            Link expired? <Link href="/forgot-password" className="text-pink-400">Request a new one</Link>
          </p>
        )}
      </div>
    </main>
  );
}
