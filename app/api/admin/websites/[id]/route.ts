export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  if (!['draft', 'published', 'archived'].includes(b.status)) {
    return NextResponse.json({ error: 'status must be draft, published or archived' }, { status: 400 });
  }
  const row = await db.website.update({ where: { id: params.id }, data: { status: b.status } });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  await db.website.deleteMany({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
