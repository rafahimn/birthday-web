import { NextResponse, type NextRequest } from 'next/server';

const COOKIE = 'bb_session';
const REFRESH_COOKIE = `${COOKIE}_refresh`;

// Supabase access tokens are short-lived JWTs (usually ~1 hour). Without this,
// the cookie itself lives for 30 days but the token inside it silently expires,
// so every request after ~1 hour looks "logged out" and bounces to /login even
// though the person never actually logged out. This decodes the token's `exp`
// claim (no signature check needed — we're only deciding whether to refresh,
// Supabase still validates the token for real on every API call) and, if it's
// expired or about to expire, swaps in a fresh access/refresh token pair
// before the request reaches any page or API route.
function getExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp === 'number' ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const access = req.cookies.get(COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) return res; // never logged in, or fully logged out — nothing to refresh

  const exp = access ? getExpiry(access) : null;
  const stillValid = exp !== null && exp > Date.now() + 60_000; // 60s safety buffer
  if (stillValid) return res;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;

  try {
    const r = await fetch(`${url.replace(/\/$/, '')}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
      cache: 'no-store',
    });
    if (!r.ok) return res;
    const d = await r.json();
    if (!d?.access_token) return res;

    const opts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    };
    res.cookies.set(COOKIE, d.access_token, opts);
    if (d.refresh_token) res.cookies.set(REFRESH_COOKIE, d.refresh_token, opts);
  } catch {
    // Network/refresh failure — fall through and let the page's own auth
    // check handle it (worst case, the person is asked to log in again).
  }

  return res;
}

export const config = {
  matcher: [
    // Run on everything except static assets, the public template, and image files.
    '/((?!_next/static|_next/image|favicon.ico|master-template.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
