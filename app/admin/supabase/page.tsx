'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/admin/system-health').then(r => r.ok ? r.json() : null).then(j => { setD(j); setLoading(false); });
  }
  useEffect(load, []);

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">System Health</h1>
          <button className="btn2" onClick={load} disabled={loading}>{loading ? 'Checking…' : 'Recheck'}</button>
        </div>
        <p className="mt-2 text-zinc-400">Verifies the environment variables and Supabase connection this deployment needs. Use this first whenever the site shows an HTTP 500.</p>

        {d && (
          <>
            <h2 className="mt-6 font-semibold text-pink-300">Environment variables</h2>
            <div className="mt-3 space-y-2">
              {d.envChecks.map((c: any) => (
                <div key={c.name} className="flex items-start justify-between gap-4 rounded-2xl bg-white/5 p-4">
                  <div>
                    <code className="text-sm">{c.name}</code>
                    {!c.ok && <p className="mt-1 text-xs text-amber-300">{c.hint}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${c.ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                    {c.ok ? 'OK' : 'Missing/Invalid'}
                  </span>
                </div>
              ))}
            </div>

            <h2 className="mt-6 font-semibold text-pink-300">Supabase connection</h2>
            <div className="mt-3 rounded-2xl bg-white/5 p-4">
              {d.restReachable === null && <p className="text-sm text-zinc-400">Not tested — fix the missing environment variables above first.</p>}
              {d.restReachable === true && <p className="text-sm text-emerald-300">✓ Reachable — the database responded successfully.</p>}
              {d.restReachable === false && (
                <>
                  <p className="text-sm text-red-300">✗ Could not reach Supabase.</p>
                  {d.restError && <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-black/40 p-3 text-xs text-zinc-400">{d.restError}</pre>}
                </>
              )}
              <p className="mt-2 text-xs text-zinc-600">Checked at {new Date(d.checkedAt).toLocaleString()}</p>
            </div>
          </>
        )}
        {!d && loading && <p className="mt-6 text-sm text-zinc-500">Checking…</p>}
      </div>
    </main>
  );
}
