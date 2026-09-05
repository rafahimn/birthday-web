export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

function present(name: string) {
  const v = process.env[name];
  return !!v && v.trim().length > 0;
}
function looksLikeUrl(name: string) {
  const v = process.env[name];
  if (!v) return false;
  try { new URL(v); return true; } catch { return false; }
}

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }

  const envChecks = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', ok: present('NEXT_PUBLIC_SUPABASE_URL') && looksLikeUrl('NEXT_PUBLIC_SUPABASE_URL'), hint: 'Must be a full https:// URL from Supabase project settings.' },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', ok: present('NEXT_PUBLIC_SUPABASE_ANON_KEY'), hint: 'Copy the anon/public key from Supabase API settings.' },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', ok: present('SUPABASE_SERVICE_ROLE_KEY'), hint: 'Copy the service_role key — keep it server-side only.' },
    { name: 'NEXT_PUBLIC_APP_URL', ok: present('NEXT_PUBLIC_APP_URL') && looksLikeUrl('NEXT_PUBLIC_APP_URL'), hint: 'Must include https:// — e.g. https://your-app.vercel.app' },
    { name: 'ADMIN_EMAIL', ok: present('ADMIN_EMAIL'), hint: 'The email that gets auto-promoted to admin on login.' },
  ];

  let restReachable: boolean | null = null;
  let restError: string | null = null;
  if (present('NEXT_PUBLIC_SUPABASE_URL') && present('SUPABASE_SERVICE_ROLE_KEY')) {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '');
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const r = await fetch(`${url}/rest/v1/settings?select=key&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
      });
      restReachable = r.ok;
      if (!r.ok) restError = `HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`;
    } catch (e: any) {
      restReachable = false;
      restError = e?.message || 'Network error';
    }
  }

  return NextResponse.json({ envChecks, restReachable, restError, checkedAt: new Date().toISOString() });
}
