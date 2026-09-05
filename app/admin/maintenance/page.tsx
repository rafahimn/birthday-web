'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/maintenance').then(r => r.ok ? r.json() : null).then(j => {
      if (j) { setEnabled(j.enabled); setMessage(j.message || ''); }
      setLoaded(true);
    });
  }, []);

  async function save(next: boolean) {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/maintenance', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ enabled: next, message }) });
      if (r.ok) setEnabled(next);
    } finally { setLoading(false); }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Maintenance Mode</h1>
        <p className="mt-2 text-zinc-400">When on, every public page (dashboard, builder, published sites) shows a maintenance notice. The admin panel and login stay reachable so you can turn it back off.</p>

        {loaded && (
          <>
            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-4">
              <div>
                <b>Site is currently {enabled ? 'in maintenance' : 'live'}</b>
              </div>
              <button className={enabled ? 'btn' : 'btn2'} disabled={loading} onClick={() => save(!enabled)}>
                {loading ? '…' : enabled ? 'Turn off' : 'Turn on'}
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm text-zinc-400">Message shown to visitors</label>
              <textarea className="mt-2 w-full" rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="We are performing scheduled maintenance. Please check back shortly." />
              <button className="btn2 mt-2" disabled={loading} onClick={() => save(enabled)}>Save message</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
