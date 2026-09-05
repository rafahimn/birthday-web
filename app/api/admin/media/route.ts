export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const [items, users] = await Promise.all([
    db.media.findMany({ orderBy: { createdAt: 'desc' }, take: 300 }),
    db.user.findMany({}),
  ]);
  const byId: Record<string, any> = {};
  for (const u of users) byId[u.id] = u;
  const out = items.map((m: any) => ({ ...m, ownerEmail: byId[m.userId]?.email || null }));
  return NextResponse.json(out);
}
