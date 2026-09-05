export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  const data: any = {};
  if (typeof b.active === 'boolean') data.active = b.active;
  if (typeof b.title === 'string') data.title = b.title;
  if (b.content && typeof b.content === 'object') data.content = b.content;
  const row = await db.demoSite.update({ where: { id: params.id }, data });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  await db.demoSite.deleteMany({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
