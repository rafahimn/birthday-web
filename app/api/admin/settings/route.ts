export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

async function readSettings() {
  const [approvalRow, tokenRow] = await Promise.all([
    db.setting.findUnique({ where: { key: 'approval_system' } }),
    db.setting.findUnique({ where: { key: 'signup_invite_token' } }),
  ]);
  return {
    approvalEnabled: !!approvalRow?.value?.enabled,
    inviteToken: tokenRow?.value?.token || null,
  };
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json(await readSettings());
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));

  if (typeof body.approvalEnabled === 'boolean') {
    await db.setting.upsert({
      where: { key: 'approval_system' },
      update: { value: { enabled: body.approvalEnabled } },
      create: { key: 'approval_system', value: { enabled: body.approvalEnabled } },
    });
  }

  if (body.regenerateInvite) {
    const token = crypto.randomBytes(16).toString('hex');
    await db.setting.upsert({
      where: { key: 'signup_invite_token' },
      update: { value: { token } },
      create: { key: 'signup_invite_token', value: { token } },
    });
  }

  return NextResponse.json(await readSettings());
}
