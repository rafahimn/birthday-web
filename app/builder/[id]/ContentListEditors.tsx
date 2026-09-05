'use client';
import { useState } from 'react';
import type { BirthdayContent } from '@/lib/types';

type Props = { content: BirthdayContent; onChange: (c: BirthdayContent) => void };

export function TimelineEditor({ content, onChange }: Props) {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function add() {
    if (!date.trim() && !title.trim()) return;
    onChange({ ...content, timeline: [...content.timeline, { date, title, description }] });
    setDate(''); setTitle(''); setDescription('');
  }
  function remove(i: number) {
    onChange({ ...content, timeline: content.timeline.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      <p className="text-zinc-400">Add key moments — these appear in a "Timeline" section on the published site.</p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <input placeholder="Date (e.g. 2020-06-14)" value={date} onChange={e => setDate(e.target.value)} />
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <button className="btn2 mt-2" onClick={add}>+ Add moment</button>
      <div className="mt-4 space-y-2">
        {content.timeline.map((t, i) => (
          <div key={i} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3 text-sm">
            <div><b>{t.date}</b>{t.title ? ` — ${t.title}` : ''}{t.description ? <div className="text-zinc-400">{t.description}</div> : null}</div>
            <button onClick={() => remove(i)}>×</button>
          </div>
        ))}
        {!content.timeline.length && <p className="text-sm text-zinc-500">No timeline moments yet.</p>}
      </div>
    </div>
  );
}

export function MemoriesEditor({ content, onChange }: Props) {
  const [text, setText] = useState('');
  function add() {
    if (!text.trim()) return;
    onChange({ ...content, memories: [...content.memories, text] });
    setText('');
  }
  function remove(i: number) {
    onChange({ ...content, memories: content.memories.filter((_, idx) => idx !== i) });
  }
  return (
    <div>
      <p className="text-zinc-400">Short memory notes — shown in a "Memories" section on the published site.</p>
      <div className="mt-3 flex gap-2">
        <input placeholder="e.g. That road trip to Cox's Bazar" value={text} onChange={e => setText(e.target.value)} className="flex-1" />
        <button className="btn2" onClick={add}>+ Add</button>
      </div>
      <div className="mt-4 space-y-2">
        {content.memories.map((m, i) => (
          <div key={i} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3 text-sm">
            <span>{m}</span>
            <button onClick={() => remove(i)}>×</button>
          </div>
        ))}
        {!content.memories.length && <p className="text-sm text-zinc-500">No memories added yet.</p>}
      </div>
    </div>
  );
}

export function WishlistEditor({ content, onChange }: Props) {
  const [text, setText] = useState('');
  function add() {
    if (!text.trim()) return;
    onChange({ ...content, wishlist: [...content.wishlist, text] });
    setText('');
  }
  function remove(i: number) {
    onChange({ ...content, wishlist: content.wishlist.filter((_, idx) => idx !== i) });
  }
  return (
    <div>
      <p className="text-zinc-400">Gift wishlist items — shown as a simple list on the published site.</p>
      <div className="mt-3 flex gap-2">
        <input placeholder="e.g. A good pair of headphones" value={text} onChange={e => setText(e.target.value)} className="flex-1" />
        <button className="btn2" onClick={add}>+ Add</button>
      </div>
      <div className="mt-4 space-y-2">
        {content.wishlist.map((w, i) => (
          <div key={i} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3 text-sm">
            <span>{w}</span>
            <button onClick={() => remove(i)}>×</button>
          </div>
        ))}
        {!content.wishlist.length && <p className="text-sm text-zinc-500">No wishlist items yet.</p>}
      </div>
    </div>
  );
}

export function GuestbookToggle({ content, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={content.guestbook} onChange={e => onChange({ ...content, guestbook: e.target.checked })} />
      Allow visitors to leave guestbook messages
    </label>
  );
}
