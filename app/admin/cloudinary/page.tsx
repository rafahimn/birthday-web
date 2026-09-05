'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [d, setD] = useState<any>(null);
  useEffect(() => { fetch('/api/admin/storage').then(r => r.ok ? r.json() : null).then(setD); }, []);

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Storage Overview</h1>
        <p className="mt-2 text-zinc-400">This app stores uploads in Supabase Storage (bucket: <code>{d?.bucket || 'birthday-builder'}</code>) rather than Cloudinary — no separate Cloudinary account is used or required.</p>

        {d && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4"><div className="text-2xl font-bold">{d.totalFiles}</div><div className="text-xs text-zinc-500">Total files</div></div>
              {Object.entries(d.byType || {}).map(([t, c]: any) => (
                <div key={t} className="rounded-2xl bg-white/5 p-4"><div className="text-2xl font-bold">{c}</div><div className="text-xs capitalize text-zinc-500">{t}</div></div>
              ))}
            </div>
            <p className="mt-4 text-xs text-zinc-500">Manage individual files from the Media Library page.</p>
          </>
        )}
      </div>
    </main>
  );
}
