import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { sessionCookie } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mail';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const STATE_COOKIE = 'bb_google_state';

type GoogleToken = { access_token?: string };
type GoogleUser = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

function redirect(req: Request, error: string) {
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
}

export async function GET(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const code = requestUrl.searchParams.get('code');
    const state = requestUrl.searchParams.get('state');
    const savedState = (await import('next/headers')).cookies().get(STATE_COOKIE)?.value;

    if (!code || !state || !savedState || !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(savedState))) {
      return redirect(req, 'google_invalid_state');
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${requestUrl.origin}/api/auth/google/callback`;

    if (!clientId || !clientSecret) return redirect(req, 'google_not_configured');

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
      cache: 'no-store',
    });

    if (!tokenResponse.ok) return redirect(req, 'google_token_failed');

    const token = (await tokenResponse.json()) as GoogleToken;
    if (!token.access_token) return redirect(req, 'google_token_failed');

    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: 'no-store',
    });

    if (!profileResponse.ok) return redirect(req, 'google_profile_failed');

    const profile = (await profileResponse.json()) as GoogleUser;
    const email = profile.email?.trim().toLowerCase();

    if (!profile.sub || !email || profile.email_verified !== true) {
      return redirect(req, 'google_email_not_verified');
    }

    let user = await db.user.findUnique({ where: { email } });
    let isNew = false;

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: profile.name || email.split('@')[0],
          emailVerified: new Date(),
          profile: { create: { avatarUrl: profile.picture || undefined } },
        },
      });
      isNew = true;
    } else {
      if (!user.emailVerified) {
        user = await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }

      // Keep the profile relation out of the User query type. Upsert is
      // deterministic for both existing and previously-unprofiled users.
      if (profile.picture) {
        await db.profile.upsert({
          where: { userId: user.id },
          update: { avatarUrl: profile.picture },
          create: { userId: user.id, avatarUrl: profile.picture },
        });
      }
    }

    if (isNew) {
      await sendWelcomeEmail(user.email, user.name).catch(() => {});
    }

    const response = NextResponse.redirect(new URL('/dashboard', req.url));
    response.cookies.set(sessionCookie, user.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set(STATE_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
    return response;
  } catch {
    return redirect(req, 'google_login_failed');
  }
}
