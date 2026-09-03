'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [v, setV] = useState({ name: '', email: '', password: '' });
  const [invite, setInvite] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const i = new URLSearchParams(window.location.search).get('invite');
    if (i) setInvite(i);
  }, []);

  async function go(e: any) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(invite ? { ...v, invite } : v),
      });
      const j = await r.json();
      if (!r.ok) return setErr(j.error || 'Signup failed');
      if (j.requiresEmailVerification) return setMsg('Account created. Please check your email and verify your address before logging in.');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <div className="card p-7">
        <h1 className="text-3xl font-bold">Create account</h1>
        {invite && <p className="mt-3 text-sm text-emerald-400">Invite link detected — your account will be approved instantly.</p>}
        <form onSubmit={go} className="mt-6 space-y-4">
          {[['name', 'Full name'], ['email', 'Email'], ['password', 'Password']].map(([k, p]) => (
            <input key={k} placeholder={p} type={k === 'password' ? 'password' : 'text'} value={(v as any)[k]} onChange={e => setV({ ...v, [k]: e.target.value })} />
          ))}
          {err && <p className="text-red-400">{err}</p>}
          {msg && <p className="text-emerald-400">{msg}</p>}
          <button className="btn w-full" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</button>
        </form>
      </div>
    </main>
  );
}
