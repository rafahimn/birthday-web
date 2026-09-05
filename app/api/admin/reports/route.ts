export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const [guestbook, sites] = await Promise.all([
    db.guestbook.findMany({ orderBy: { createdAt: 'desc' }, take: 300 }),
    db.website.findMany({}),
  ]);
  const byId: Record<string, any> = {};
  for (const s of sites) byId[s.id] = s;
  const out = guestbook.map((g: any) => ({ ...g, siteTitle: byId[g.websiteId]?.title || null, siteSlug: byId[g.websiteId]?.slug || null }));
  return NextResponse.json(out);
}
