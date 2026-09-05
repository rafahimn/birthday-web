export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const data: any = {};
  if (typeof body.approved === 'boolean') data.approved = body.approved;
  if (typeof body.role === 'string' && ['user', 'admin', 'support'].includes(body.role)) data.role = body.role;
  if (!Object.keys(data).length) {
    return NextResponse.json({ error: 'approved (boolean) or role (user|admin|support) is required' }, { status: 400 });
  }
  const updated = await db.user.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}
