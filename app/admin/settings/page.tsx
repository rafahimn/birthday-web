export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import SettingsPanel from './SettingsPanel';

export default async function AdminSettings() {
  try {
    await requireAdmin();
  } catch {
    redirect('/login?error=admin_required');
  }
  const [approvalRow, tokenRow] = await Promise.all([
    db.setting.findUnique({ where: { key: 'approval_system' } }),
    db.setting.findUnique({ where: { key: 'signup_invite_token' } }),
  ]);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Website Settings</h1>
      <SettingsPanel
        initialEnabled={!!approvalRow?.value?.enabled}
        initialToken={tokenRow?.value?.token || null}
        appUrl={appUrl}
      />
    </main>
  );
}
