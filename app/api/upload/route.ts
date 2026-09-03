export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { supabaseStorageUpload } from '@/lib/supabase-rest';

const ALLOWED = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg',
  'video/mp4', 'video/webm', 'video/quicktime'
]);
const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File must be between 1 byte and 25 MB.' }, { status: 413 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 415 });
    }

    const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const safeExt = ext || 'bin';
    const folder = String(form.get('folder') || 'shared').replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'shared';
    const path = `users/${user.id}/${folder}/${crypto.randomUUID()}.${safeExt}`;
    const url = await supabaseStorageUpload('birthday-builder', path, file);

    const media = await db.media.create({
      data: { userId: user.id, url, type: file.type, folder }
    });

    return NextResponse.json({ ok: true, url, media }, { status: 201 });
  } catch (error) {
    console.error('upload failed', error);
    return NextResponse.json({ error: 'Upload failed. Check Supabase Storage configuration.' }, { status: 500 });
  }
}
