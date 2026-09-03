'use client';
import { useRef, useState } from 'react';
import type { GalleryItem } from '@/lib/types';

async function uploadFile(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const r = await fetch('/api/upload', { method: 'POST', body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'Upload failed');
  return j.url as string;
}

// Single-file uploader for music/video: no URL field, just pick a file and it
// uploads straight to storage.
export function SingleMediaUpload({
  kind,
  url,
  onChange,
}: {
  kind: 'audio' | 'video';
  url: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const uploaded = await uploadFile(file, kind === 'audio' ? 'music' : 'video');
      onChange(uploaded);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {url ? (
        kind === 'audio' ? (
          <audio controls src={url} className="w-full" />
        ) : (
          <video controls src={url} className="w-full rounded-xl" />
        )
      ) : (
        <p className="text-sm text-zinc-500">No {kind === 'audio' ? 'music' : 'video'} uploaded yet.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn2" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? 'Uploading…' : url ? 'Replace file' : 'Upload file'}
        </button>
        {url && (
          <button type="button" className="btn2" onClick={() => onChange('')} disabled={busy}>
            Remove
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept={kind === 'audio' ? 'audio/*' : 'video/*'} className="hidden" onChange={pick} />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

// Multi-file uploader for the photo gallery.
export function GalleryUpload({
  items,
  onChange,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const uploaded: GalleryItem[] = [];
      for (const file of files) {
        uploaded.push({ url: await uploadFile(file, 'gallery') });
      }
      onChange([...items, ...uploaded]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {items.map((item, i) => (
          <div key={item.url + i} className="group relative overflow-hidden rounded-lg border border-white/10">
            <img src={item.url} alt="" className="h-24 w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {!items.length && <p className="text-sm text-zinc-500">No photos uploaded yet.</p>}
      <button type="button" className="btn2" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? 'Uploading…' : 'Upload photos'}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={pick} />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
