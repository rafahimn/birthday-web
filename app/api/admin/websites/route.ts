export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const [sites, users] = await Promise.all([
    db.website.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
    db.user.findMany({}),
  ]);
  const byId: Record<string, any> = {};
  for (const u of users) byId[u.id] = u;
  const out = sites.map((s: any) => ({ ...s, ownerEmail: byId[s.userId]?.email || null, ownerName: byId[s.userId]?.name || null }));
  return NextResponse.json(out);
}
