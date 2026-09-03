import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {googleStateCookie,googleVerifierCookie,googleInviteCookie} from '@/lib/auth';
function base64url(b:Buffer){return b.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
export async function GET(req:Request){
 const supabase=process.env.NEXT_PUBLIC_SUPABASE_URL, app=process.env.NEXT_PUBLIC_APP_URL||new URL(req.url).origin;
 if(!supabase)return NextResponse.redirect(new URL('/login?error=supabase_not_configured',req.url));
 const invite=new URL(req.url).searchParams.get('invite')||'';
 const verifier=base64url(crypto.randomBytes(32)); const challenge=base64url(crypto.createHash('sha256').update(verifier).digest()); const state=base64url(crypto.randomBytes(24));
 const redirectTo=`${app.replace(/\/$/,'')}/api/auth/google/callback`;
 const authUrl=new URL(`${supabase.replace(/\/$/,'')}/auth/v1/authorize`);authUrl.searchParams.set('provider','google');authUrl.searchParams.set('redirect_to',redirectTo);authUrl.searchParams.set('code_challenge',challenge);authUrl.searchParams.set('code_challenge_method','s256');authUrl.searchParams.set('state',state);
 const r=NextResponse.redirect(authUrl); const opts={httpOnly:true,sameSite:'lax' as const,secure:process.env.NODE_ENV==='production',path:'/',maxAge:600};r.cookies.set(googleStateCookie,state,opts);r.cookies.set(googleVerifierCookie,verifier,opts);
 if(invite)r.cookies.set(googleInviteCookie,invite,opts);
 return r;
}
