'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [greeting, setGreeting] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  function load() { fetch('/api/admin/demo').then(r => r.ok ? r.json() : []).then(setItems); }
  useEffect(load, []);

  async function add() {
    if (!title.trim()) return;
    setMsg('Saving...');
    const r = await fetch('/api/admin/demo', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, content: { name, greeting } }) });
    if (r.ok) { setTitle(''); setGreeting(''); setName(''); setMsg(''); load(); } else setMsg('Failed to save.');
  }
  async function toggle(d: any) {
    const r = await fetch(`/api/admin/demo/${d.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active: !d.active }) });
    if (r.ok) setItems(xs => xs.map(x => x.id === d.id ? { ...x, active: !d.active } : x));
  }
  async function remove(d: any) {
    if (!confirm(`Delete demo "${d.title}"?`)) return;
    const r = await fetch(`/api/admin/demo/${d.id}`, { method: 'DELETE' });
    if (r.ok) setItems(xs => xs.filter(x => x.id !== d.id));
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Demo Site Variants</h1>
        <p className="mt-2 text-zinc-400">Create named demos, viewable at <code>/demo?site=your-slug</code> — useful for sharing a tailored preview with a prospective customer.</p>

        <div className="mt-6 grid gap-2 md:grid-cols-3">
          <input placeholder="Demo title" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="Birthday person's name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Greeting text" value={greeting} onChange={e => setGreeting(e.target.value)} />
        </div>
        <button className="btn2 mt-2" onClick={add}>+ Create demo</button>
        {msg && <p className="mt-2 text-xs text-zinc-400">{msg}</p>}

        <div className="mt-6 space-y-2">
          {items.map(d => (
            <div key={d.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4">
              <div>
                <b>{d.title}</b>
                <div className="text-xs text-zinc-500">/demo?site={d.slug}</div>
              </div>
              <div className="flex gap-2">
                <a className="btn2" href={`/demo?site=${d.slug}`} target="_blank" rel="noreferrer">Preview</a>
                <button className="btn2" onClick={() => toggle(d)}>{d.active ? 'Active' : 'Hidden'}</button>
                <button className="btn2" onClick={() => remove(d)}>Delete</button>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-sm text-zinc-500">No demo variants yet — the default /demo still works without any.</p>}
        </div>
      </div>
    </main>
  );
}
