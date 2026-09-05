export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const rows = await db.emailTemplate.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  const key = String(b.key || '').trim();
  const subject = String(b.subject || '').trim();
  const body = String(b.body || '').trim();
  if (!key || !subject || !body) return NextResponse.json({ error: 'key, subject and body are required' }, { status: 400 });
  const row = await db.emailTemplate.create({ data: { key, subject, body } });
  return NextResponse.json(row, { status: 201 });
}
