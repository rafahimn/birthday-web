export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const rows = await db.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 500 });
  // Group by title+message+minute so a single broadcast (one row per user) shows as one entry.
  const seen = new Map<string, { title: string; message: string; createdAt: any; count: number }>();
  for (const n of rows) {
    const bucket = new Date(n.createdAt).toISOString().slice(0, 16);
    const key = `${n.title}::${n.message}::${bucket}`;
    const cur = seen.get(key);
    if (cur) cur.count++;
    else seen.set(key, { title: n.title, message: n.message, createdAt: n.createdAt, count: 1 });
  }
  return NextResponse.json(Array.from(seen.values()));
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  const title = String(b.title || '').trim();
  const message = String(b.message || '').trim();
  if (!title || !message) return NextResponse.json({ error: 'title and message are required' }, { status: 400 });
  const users = await db.user.findMany({});
  await Promise.all(users.map((u: any) => db.notification.create({ data: { userId: u.id, title, message } })));
  return NextResponse.json({ ok: true, sentTo: users.length });
}
