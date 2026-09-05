export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const items = await db.media.findMany({ orderBy: { createdAt: 'desc' } });
  const byType: Record<string, number> = {};
  for (const m of items) {
    const t = String(m.type || 'other').split('/')[0];
    byType[t] = (byType[t] || 0) + 1;
  }
  return NextResponse.json({
    bucket: 'birthday-builder',
    totalFiles: items.length,
    byType,
    recent: items.slice(0, 5).map((m: any) => ({ url: m.url, type: m.type, createdAt: m.createdAt })),
  });
}
