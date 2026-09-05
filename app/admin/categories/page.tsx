'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');

  function load() { fetch('/api/admin/categories').then(r => r.ok ? r.json() : []).then(setItems); }
  useEffect(load, []);

  async function add() {
    if (!name.trim()) return;
    setMsg('Adding...');
    const r = await fetch('/api/admin/categories', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, description: desc }) });
    if (r.ok) { setName(''); setDesc(''); setMsg(''); load(); } else setMsg('Failed to add.');
  }
  async function toggle(c: any) {
    const r = await fetch(`/api/admin/categories/${c.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active: !c.active }) });
    if (r.ok) setItems(xs => xs.map(x => x.id === c.id ? { ...x, active: !c.active } : x));
  }
  async function remove(c: any) {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    const r = await fetch(`/api/admin/categories/${c.id}`, { method: 'DELETE' });
    if (r.ok) setItems(xs => xs.filter(x => x.id !== c.id));
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Template Categories</h1>
        <p className="mt-2 text-zinc-400">Manage the categories templates can belong to.</p>

        <div className="mt-6 grid gap-2 md:grid-cols-3">
          <input placeholder="Category name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} className="md:col-span-1" />
          <button className="btn2" onClick={add}>+ Add category</button>
        </div>
        {msg && <p className="mt-2 text-xs text-zinc-400">{msg}</p>}

        <div className="mt-6 space-y-2">
          {items.map(c => (
            <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4">
              <div>
                <b>{c.name}</b>
                <div className="text-xs text-zinc-500">{c.slug}{c.description ? ` — ${c.description}` : ''}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn2" onClick={() => toggle(c)}>{c.active ? 'Active' : 'Hidden'}</button>
                <button className="btn2" onClick={() => remove(c)}>Delete</button>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-sm text-zinc-500">No categories yet.</p>}
        </div>
      </div>
    </main>
  );
}
