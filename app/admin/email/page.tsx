'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [key, setKey] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState<Record<string, { subject: string; body: string }>>({});

  function load() { fetch('/api/admin/email-templates').then(r => r.ok ? r.json() : []).then(setItems); }
  useEffect(load, []);

  async function add() {
    if (!key.trim() || !subject.trim() || !body.trim()) return;
    setMsg('Saving...');
    const r = await fetch('/api/admin/email-templates', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key, subject, body }) });
    if (r.ok) { setKey(''); setSubject(''); setBody(''); setMsg(''); load(); } else setMsg('Failed — key may already exist.');
  }
  function edit(t: any, field: 'subject' | 'body', value: string) {
    setEditing(e => ({ ...e, [t.id]: { subject: field === 'subject' ? value : (e[t.id]?.subject ?? t.subject), body: field === 'body' ? value : (e[t.id]?.body ?? t.body) } }));
  }
  async function save(t: any) {
    const patch = editing[t.id]; if (!patch) return;
    const r = await fetch(`/api/admin/email-templates/${t.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch) });
    if (r.ok) load();
  }
  async function remove(t: any) {
    if (!confirm(`Delete template "${t.key}"?`)) return;
    const r = await fetch(`/api/admin/email-templates/${t.id}`, { method: 'DELETE' });
    if (r.ok) setItems(xs => xs.filter(x => x.id !== t.id));
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="mt-2 text-zinc-400">Manage the subject/body text used for transactional emails.</p>

        <div className="mt-6 grid gap-2">
          <input placeholder="Key (e.g. welcome, reset-password)" value={key} onChange={e => setKey(e.target.value)} />
          <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} rows={4} />
          <button className="btn2" onClick={add}>+ Add template</button>
          {msg && <p className="text-xs text-zinc-400">{msg}</p>}
        </div>

        <div className="mt-8 space-y-4">
          {items.map(t => (
            <div key={t.id} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <b className="text-pink-300">{t.key}</b>
                <button className="btn2" onClick={() => remove(t)}>Delete</button>
              </div>
              <input className="mt-3 w-full" defaultValue={t.subject} onChange={e => edit(t, 'subject', e.target.value)} />
              <textarea className="mt-2 w-full" defaultValue={t.body} rows={4} onChange={e => edit(t, 'body', e.target.value)} />
              <button className="btn2 mt-2" onClick={() => save(t)}>Save changes</button>
            </div>
          ))}
          {!items.length && <p className="text-sm text-zinc-500">No email templates yet.</p>}
        </div>
      </div>
    </main>
  );
}
