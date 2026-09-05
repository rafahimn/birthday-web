'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [msg, setMsg] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/seo').then(r => r.ok ? r.json() : {}).then((j: any) => {
      setTitle(j.title || ''); setDescription(j.description || ''); setOgImage(j.ogImage || '');
      setLoaded(true);
    });
  }, []);

  async function save() {
    setMsg('Saving...');
    const r = await fetch('/api/admin/seo', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title, description, ogImage }) });
    setMsg(r.ok ? 'Saved!' : 'Failed to save.');
  }

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">SEO Defaults</h1>
        <p className="mt-2 text-zinc-400">Controls the homepage's title, description and share preview image. Individual birthday sites keep their own SEO fields from the builder.</p>

        {loaded && (
          <div className="mt-6 grid gap-3">
            <div>
              <label className="text-sm text-zinc-400">Site title</label>
              <input className="mt-1 w-full" value={title} onChange={e => setTitle(e.target.value)} placeholder="Birthday Builder — Create beautiful interactive birthday websites" />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Meta description</label>
              <textarea className="mt-1 w-full" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Create beautiful interactive birthday websites." />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Default share image URL</label>
              <input className="mt-1 w-full" value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://.../preview.png" />
            </div>
            <button className="btn2" onClick={save}>Save</button>
            {msg && <p className="text-xs text-zinc-400">{msg}</p>}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a className="underline" href="/robots.txt" target="_blank" rel="noreferrer">View robots.txt</a>
          <a className="underline" href="/sitemap.xml" target="_blank" rel="noreferrer">View sitemap.xml</a>
        </div>
      </div>
    </main>
  );
}
