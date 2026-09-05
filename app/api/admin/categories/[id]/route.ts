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
  if (typeof b.name === 'string') data.name = b.name;
  if (typeof b.description === 'string') data.description = b.description;
  if (typeof b.sort === 'number') data.sort = b.sort;
  const row = await db.templateCategory.update({ where: { id: params.id }, data });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  await db.templateCategory.deleteMany({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
