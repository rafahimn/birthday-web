export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const rows = await db.templateCategory.findMany({ orderBy: { sort: 'asc' } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || '').trim();
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  const slug = String(b.slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const row = await db.templateCategory.create({ data: { name, slug, description: b.description || null, sort: Number(b.sort) || 0 } });
  return NextResponse.json(row, { status: 201 });
}
