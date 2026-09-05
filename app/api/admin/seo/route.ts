export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const row = await db.setting.findUnique({ where: { key: 'seo_defaults' } });
  return NextResponse.json(row?.value || { title: '', description: '', ogImage: '' });
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  const value = { title: String(b.title || ''), description: String(b.description || ''), ogImage: String(b.ogImage || '') };
  await db.setting.upsert({ where: { key: 'seo_defaults' }, update: { value }, create: { key: 'seo_defaults', value } });
  return NextResponse.json(value);
}
