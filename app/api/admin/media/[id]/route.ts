export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { supabaseStorageDelete } from '@/lib/supabase-rest';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const item = await db.media.findUnique({ where: { id: params.id } });
  if (item?.url) {
    const marker = '/storage/v1/object/public/birthday-builder/';
    const idx = String(item.url).indexOf(marker);
    if (idx >= 0) {
      const path = decodeURIComponent(item.url.slice(idx + marker.length));
      await supabaseStorageDelete('birthday-builder', path).catch(() => {});
    }
  }
  await db.media.deleteMany({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
