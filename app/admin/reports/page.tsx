'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');

  function load() { fetch('/api/admin/reports').then(r => r.ok ? r.json() : []).then(setItems); }
  useEffect(load, []);

  async function setApproved(g: any, approved: boolean) {
    const r = await fetch(`/api/admin/reports/${g.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ approved }) });
    if (r.ok) setItems(xs => xs.map(x => x.id === g.id ? { ...x, approved } : x));
  }
  async function remove(g: any) {
    if (!confirm('Delete this guestbook message?')) return;
    const r = await fetch(`/api/admin/reports/${g.id}`, { method: 'DELETE' });
    if (r.ok) setItems(xs => xs.filter(x => x.id !== g.id));
  }

  const visible = items.filter(g => filter === 'all' || (filter === 'pending' ? !g.approved : g.approved));

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Content Moderation</h1>
        <p className="mt-2 text-zinc-400">Review guestbook messages left across every birthday site.</p>

        <div className="mt-4 flex gap-2">
          {(['pending', 'approved', 'all'] as const).map(f => (
            <button key={f} className={filter === f ? 'btn' : 'btn2'} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {visible.map(g => (
            <div key={g.id} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{g.name} · on {g.siteTitle || g.siteSlug || 'a site'}</span>
                <span>{new Date(g.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm">{g.message}</p>
              <div className="mt-3 flex gap-2">
                {!g.approved && <button className="btn2" onClick={() => setApproved(g, true)}>Approve</button>}
                {g.approved && <button className="btn2" onClick={() => setApproved(g, false)}>Unapprove</button>}
                <button className="btn2" onClick={() => remove(g)}>Delete</button>
              </div>
            </div>
          ))}
          {!visible.length && <p className="text-sm text-zinc-500">Nothing here.</p>}
        </div>
      </div>
    </main>
  );
}
