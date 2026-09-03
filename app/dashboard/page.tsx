export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Link from 'next/link';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default async function Dashboard({ searchParams }: { searchParams: { pending?: string } }) {
  const u = await getSessionUser();
  if (!u) redirect('/login');

  const gated = u.role !== 'admin' && !u.approved && await isApprovalRequired();

  let sites: any[] = [];
  let loadError = '';
  try {
    sites = await db.website.findMany({ where: { userId: u.id }, orderBy: { updatedAt: 'desc' } });
  } catch (error) {
    console.error('dashboard websites load failed', error);
    loadError = 'Your account loaded, but websites could not be loaded. Check Supabase tables/RLS.';
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-zinc-400">Dashboard</p><h1 className="text-4xl font-black">Hi, {u.name || u.email}</h1></div>
        <div className="flex flex-wrap gap-2">
          {u.role === 'admin' && <Link className="btn2" href="/admin">Admin Panel</Link>}
          {gated ? (
            <span className="btn2 cursor-not-allowed opacity-60" title="Waiting for admin approval">+ Create Website</span>
          ) : (
            <Link className="btn" href="/builder/new">+ Create Website</Link>
          )}
          <a className="btn2" href="/api/auth/logout">Logout</a>
        </div>
      </header>
      {gated && (
        <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-200">
          Your account is waiting for admin approval. You can look around, but you&apos;ll be able to create a website once an admin approves you.
        </div>
      )}
      {loadError && <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-200">{loadError}</div>}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-zinc-400">Websites</p><b className="text-3xl">{sites.length}</b></div>
        <div className="card p-5"><p className="text-zinc-400">Published</p><b className="text-3xl">{sites.filter(s => s.status === 'published').length}</b></div>
        <div className="card p-5"><p className="text-zinc-400">Total views</p><b className="text-3xl">{sites.reduce((a, s) => a + Number(s.views || 0), 0)}</b></div>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl font-bold">My Websites</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {sites.map(s => <div className="card p-5" key={s.id}><div className="flex justify-between gap-3"><div><h3 className="font-bold">{s.title}</h3><p className="text-sm text-zinc-400">/{s.slug} • {s.status}</p></div><Link href={`/builder/${s.id}`} className="btn2">Edit</Link></div></div>)}
          {!sites.length && <div className="card p-8 text-zinc-400">No websites yet. Create your first birthday experience.</div>}
        </div>
      </section>
    </main>
  );
}
