'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { defaultContent, BirthdayContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import { SingleMediaUpload, GalleryUpload } from './MediaUploader';

const fields: [keyof BirthdayContent, string][] = [
  ['name', 'Birthday Person'], ['birthday', 'Birthday'], ['greeting', 'Greeting'], ['message', 'Birthday Message'], ['relationship', 'Relationship'],
  ['heroTitle', 'Hero Title'], ['heroSubtitle', 'Hero Subtitle'],
  ['secret', 'Secret Message'], ['buttonText', 'Button Text'], ['seoTitle', 'SEO Title'], ['seoDescription', 'SEO Description'],
];

const TABS = ['Basic', 'Hero', 'Gallery', 'Music', 'Video', 'Letter', 'Theme', 'Effects', 'Timeline', 'Memories', 'Wishlist', 'Guestbook', 'SEO', 'Advanced'];

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [c, setC] = useState<BirthdayContent>(defaultContent);
  const [tab, setTab] = useState('Basic');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/websites/' + id).then(r => r.json()).then(j => j.content && setC({ ...defaultContent, ...j.content }));
  }, [id]);

  async function save(publish = false) {
    setMsg('Saving...');
    const r = await fetch('/api/websites/' + id, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: c, status: publish ? 'published' : 'draft' }),
    });
    const j = await r.json();
    setMsg(r.ok ? (publish ? 'Published!' : 'Saved!') : (j.error || 'Error'));
    if (publish) router.refresh();
  }

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto grid max-w-[1500px] gap-4 lg:grid-cols-[390px_1fr]">
        <aside className="card max-h-[calc(100vh-2rem)] overflow-auto p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Builder</h1>
            <button className="btn2" onClick={() => router.push('/dashboard')}>Exit</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {TABS.map(x => (
              <button key={x} className={`rounded-full px-3 py-2 text-xs ${tab === x ? 'bg-pink-500' : 'bg-white/10'}`} onClick={() => setTab(x)}>{x}</button>
            ))}
          </div>

          {tab === 'Basic' && (
            <div className="mt-5 space-y-3">
              {fields.slice(0, 5).map(([k, l]) => (
                <label className="block text-sm" key={String(k)}>{l}
                  <input className="mt-1" value={String(c[k] ?? '')} onChange={e => setC({ ...c, [k]: e.target.value } as BirthdayContent)} />
                </label>
              ))}
            </div>
          )}

          {tab === 'Hero' && (
            <div className="mt-5 space-y-3">
              {fields.slice(5, 7).map(([k, l]) => (
                <label className="block text-sm" key={String(k)}>{l}
                  <input className="mt-1" value={String(c[k] ?? '')} onChange={e => setC({ ...c, [k]: e.target.value } as BirthdayContent)} />
                </label>
              ))}
            </div>
          )}

          {tab === 'Gallery' && (
            <div className="mt-5 space-y-4">
              <p className="text-zinc-400">Upload photos directly — no links needed.</p>
              <GalleryUpload items={c.gallery} onChange={gallery => setC({ ...c, gallery })} />
            </div>
          )}

          {tab === 'Music' && (
            <div className="mt-5 space-y-4">
              <p className="text-zinc-400">Upload a background music track directly — no links needed.</p>
              <SingleMediaUpload kind="audio" url={c.musicUrl} onChange={musicUrl => setC({ ...c, musicUrl })} />
            </div>
          )}

          {tab === 'Video' && (
            <div className="mt-5 space-y-4">
              <p className="text-zinc-400">Upload a video directly — no links needed.</p>
              <SingleMediaUpload kind="video" url={c.videoUrl} onChange={videoUrl => setC({ ...c, videoUrl })} />
            </div>
          )}

          {['Letter', 'Theme', 'Effects', 'Timeline', 'Memories', 'Wishlist', 'Guestbook', 'SEO', 'Advanced'].includes(tab) && (
            <div className="mt-5 space-y-4">
              <p className="text-zinc-400">{tab} controls are connected to the content model and preview. Use the fields below to configure the experience.</p>
              {tab === 'Letter' && <textarea rows={8} value={c.letter.join('\n')} onChange={e => setC({ ...c, letter: e.target.value.split('\n') })} />}
              {tab === 'SEO' && (
                <>
                  <input value={c.seoTitle} onChange={e => setC({ ...c, seoTitle: e.target.value })} />
                  <textarea rows={4} value={c.seoDescription} onChange={e => setC({ ...c, seoDescription: e.target.value })} />
                </>
              )}
              {tab === 'Theme' && (
                <>
                  <input type="color" value={c.primaryColor} onChange={e => setC({ ...c, primaryColor: e.target.value })} />
                  <select value={c.theme} onChange={e => setC({ ...c, theme: e.target.value })}>
                    <option>romantic</option><option>cute</option><option>luxury</option><option>anime</option>
                    <option>gaming</option><option>minimal</option><option>elegant</option><option>festival</option>
                  </select>
                </>
              )}
              {tab === 'Effects' && (
                <div className="space-y-2">
                  {(['confetti', 'fireworks', 'hearts', 'balloons', 'countdown'] as const).map(k => (
                    <label className="flex gap-2" key={k}>
                      <input type="checkbox" checked={c[k]} onChange={e => setC({ ...c, [k]: e.target.checked })} />{k}
                    </label>
                  ))}
                </div>
              )}
              {tab === 'Advanced' && (
                <textarea rows={8} value={c.customCss} onChange={e => setC({ ...c, customCss: e.target.value })} placeholder="Custom CSS (future-safe)" />
              )}
            </div>
          )}

          <div className="sticky bottom-0 mt-6 grid grid-cols-2 gap-2 bg-zinc-950 py-3">
            <button className="btn" onClick={() => save(false)}>Save Draft</button>
            <button className="btn" onClick={() => save(true)}>Publish</button>
          </div>
          {msg && <p className="text-sm text-emerald-400">{msg}</p>}
        </aside>

        <section className="card overflow-hidden">
          <div className="border-b border-white/10 p-4 text-sm text-zinc-400">Live Preview</div>
          <div className="h-[calc(100vh-6rem)] overflow-y-auto"><MasterTemplate content={c} /></div>
        </section>
      </div>
    </main>
  );
}
