'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function load() { fetch('/api/admin/websites').then(r => r.ok ? r.json() : []).then(xs => { setItems(xs); setLoading(false); }); }
  useEffect(load, []);

  async function setStatus(w: any, status: string) {
    const r = await fetch(`/api/admin/websites/${w.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) });
    if (r.ok) setItems(xs => xs.map(x => x.id === w.id ? { ...x, status } : x));
  }
  async function remove(w: any) {
    if (!confirm(`Delete website "${w.title}"? This cannot be undone.`)) return;
    const r = await fetch(`/api/admin/websites/${w.id}`, { method: 'DELETE' });
    if (r.ok) setItems(xs => xs.filter(x => x.id !== w.id));
  }

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">All Websites</h1>
        <p className="mt-2 text-zinc-400">Every birthday site created on the platform, across all users.</p>
        <div className="mt-6 overflow-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(w => (
                <tr key={w.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{w.title}</td>
                  <td className="px-4 py-3">{w.ownerEmail || '—'}</td>
                  <td className="px-4 py-3"><a className="underline" href={`/site/${w.slug}`} target="_blank" rel="noreferrer">/{w.slug}</a></td>
                  <td className="px-4 py-3 capitalize">{w.status}</td>
                  <td className="px-4 py-3">{w.views ?? 0}</td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    {w.status !== 'published' && <button className="btn2" onClick={() => setStatus(w, 'published')}>Publish</button>}
                    {w.status === 'published' && <button className="btn2" onClick={() => setStatus(w, 'draft')}>Unpublish</button>}
                    {w.status !== 'archived' && <button className="btn2" onClick={() => setStatus(w, 'archived')}>Archive</button>}
                    <button className="btn2" onClick={() => remove(w)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!loading && !items.length && <tr><td className="px-4 py-6 text-zinc-500" colSpan={6}>No websites yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
