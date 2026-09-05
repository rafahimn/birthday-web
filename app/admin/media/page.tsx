'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  function load() { fetch('/api/admin/media').then(r => r.ok ? r.json() : []).then(setItems); }
  useEffect(load, []);

  async function remove(m: any) {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    const r = await fetch(`/api/admin/media/${m.id}`, { method: 'DELETE' });
    if (r.ok) setItems(xs => xs.filter(x => x.id !== m.id));
  }

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="mt-2 text-zinc-400">{items.length} file{items.length === 1 ? '' : 's'} uploaded across all users.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map(m => (
            <div key={m.id} className="rounded-2xl bg-white/5 p-3">
              {m.type?.startsWith('image/') ? (
                <img src={m.url} alt="" className="h-32 w-full rounded-xl object-cover" />
              ) : m.type?.startsWith('video/') ? (
                <video src={m.url} className="h-32 w-full rounded-xl object-cover" muted />
              ) : (
                <div className="flex h-32 w-full items-center justify-center rounded-xl bg-black/30 text-3xl">🎵</div>
              )}
              <p className="mt-2 truncate text-xs text-zinc-400">{m.ownerEmail || 'Unknown owner'}</p>
              <p className="truncate text-[10px] text-zinc-600">{m.type}</p>
              <button className="btn2 mt-2 w-full" onClick={() => remove(m)}>Delete</button>
            </div>
          ))}
          {!items.length && <p className="text-sm text-zinc-500">No media uploaded yet.</p>}
        </div>
      </div>
    </main>
  );
}
