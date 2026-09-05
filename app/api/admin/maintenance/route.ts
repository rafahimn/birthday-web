export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const row = await db.setting.findUnique({ where: { key: 'maintenance_mode' } });
  return NextResponse.json({ enabled: !!row?.value?.enabled, message: row?.value?.message || '' });
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  const value = { enabled: !!b.enabled, message: String(b.message || '') };
  await db.setting.upsert({ where: { key: 'maintenance_mode' }, update: { value }, create: { key: 'maintenance_mode', value } });
  return NextResponse.json(value);
}
