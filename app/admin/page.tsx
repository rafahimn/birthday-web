export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { ADMIN_MODULES } from '@/lib/admin-nav';

export default async function Admin() {
  try { await requireAdmin(); } catch { redirect('/login?error=admin_required'); }
  const [users, sites, templates, demos] = await Promise.all([
    db.user.count(), db.website.count(), db.template.count(), db.demoSite.count(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-4xl font-black">Admin Panel</h1>
      <p className="mt-2 text-zinc-400">Users, websites, templates, demo, media, reports, analytics, notifications, email, SEO and system settings.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[['Users', users], ['Websites', sites], ['Templates', templates], ['Demo sites', demos]].map(([a, b]) => (
          <div className="card p-5" key={String(a)}><p className="text-zinc-400">{a}</p><b className="text-3xl">{b}</b></div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {ADMIN_MODULES.map(([label, href]) => (
          <Link href={href} key={href} className="card block p-5 transition hover:bg-white/10">
            <b>{label}</b>
            <p className="mt-2 text-sm text-zinc-500">Open →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
