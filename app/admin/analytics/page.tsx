'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [d, setD] = useState<any>(null);
  useEffect(() => { fetch('/api/admin/analytics').then(r => r.ok ? r.json() : null).then(setD); }, []);

  const cards = d ? [
    { label: 'Total users', value: d.totalUsers },
    { label: 'Total websites', value: d.totalWebsites },
    { label: 'Published', value: d.published },
    { label: 'Draft', value: d.draft },
    { label: 'Archived', value: d.archived },
    { label: 'Total views', value: d.totalViews },
    { label: 'Events (last 7 days)', value: d.eventsLast7Days },
  ] : [];

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="mt-2 text-zinc-400">A live overview across every user and website.</p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {cards.map(c => (
            <div key={c.label} className="rounded-2xl bg-white/5 p-4">
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs text-zinc-500">{c.label}</div>
            </div>
          ))}
        </div>

        {d?.dailyEvents?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold text-pink-300">Events per day (last 14 days)</h2>
            <div className="mt-3 flex items-end gap-1" style={{ height: 120 }}>
              {d.dailyEvents.map((e: any) => {
                const max = Math.max(...d.dailyEvents.map((x: any) => x.count), 1);
                return (
                  <div key={e.date} className="flex flex-1 flex-col items-center gap-1">
                    <div className="w-full rounded-t bg-pink-500/60" style={{ height: `${(e.count / max) * 100}px` }} title={`${e.date}: ${e.count}`} />
                    <span className="text-[9px] text-zinc-600">{e.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {!d && <p className="mt-6 text-sm text-zinc-500">Loading…</p>}
      </div>
    </main>
  );
}
