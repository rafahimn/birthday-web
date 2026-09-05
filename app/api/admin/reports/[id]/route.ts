export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  if (typeof b.approved !== 'boolean') return NextResponse.json({ error: 'approved (boolean) is required' }, { status: 400 });
  const row = await db.guestbook.update({ where: { id: params.id }, data: { approved: b.approved } });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  await db.guestbook.deleteMany({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
