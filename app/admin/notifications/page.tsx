'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  function load() { fetch('/api/admin/notifications').then(r => r.ok ? r.json() : []).then(setItems); }
  useEffect(load, []);

  async function send() {
    if (!title.trim() || !message.trim()) return;
    setSending(true); setMsg('Sending...');
    try {
      const r = await fetch('/api/admin/notifications', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, message }) });
      const j = await r.json();
      if (r.ok) { setMsg(`Sent to ${j.sentTo} users.`); setTitle(''); setMessage(''); load(); }
      else setMsg(j.error || 'Failed to send.');
    } finally { setSending(false); }
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Broadcast Notifications</h1>
        <p className="mt-2 text-zinc-400">Send an announcement to every registered user's notification bell.</p>

        <div className="mt-6 grid gap-2">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} rows={3} />
          <button className="btn2" onClick={send} disabled={sending}>{sending ? 'Sending…' : 'Send to all users'}</button>
          {msg && <p className="text-xs text-zinc-400">{msg}</p>}
        </div>

        <h2 className="mt-8 font-semibold text-pink-300">Recent broadcasts</h2>
        <div className="mt-3 space-y-2">
          {items.map((n, i) => (
            <div key={i} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <b>{n.title}</b>
                <span className="text-xs text-zinc-500">{new Date(n.createdAt).toLocaleString()} · sent to {n.count}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">{n.message}</p>
            </div>
          ))}
          {!items.length && <p className="text-sm text-zinc-500">No broadcasts sent yet.</p>}
        </div>
      </div>
    </main>
  );
}
