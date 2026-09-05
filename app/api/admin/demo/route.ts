export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const rows = await db.demoSite.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  const title = String(b.title || '').trim();
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });
  const slug = String(b.slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const row = await db.demoSite.create({ data: { slug, title, content: b.content || {} } });
  return NextResponse.json(row, { status: 201 });
}
