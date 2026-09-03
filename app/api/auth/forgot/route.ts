import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {googleVerifierCookie} from '@/lib/auth';
function b64(b:Buffer){return b.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
export const runtime='nodejs';
export async function POST(req:Request){
 try{
  const {email}=await req.json(); const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,app=process.env.NEXT_PUBLIC_APP_URL||new URL(req.url).origin;
  if(!url||!key)return NextResponse.json({error:'Supabase Auth is not configured'},{status:500});
  // Same PKCE dance as signup/Google login: without a code_challenge here, the
  // recovery link Supabase emails can't be exchanged for a session later, and
  // the reset-password page would have nothing to authenticate the update with.
  const verifier=b64(crypto.randomBytes(32)),challenge=b64(crypto.createHash('sha256').update(verifier).digest());
  const redirectTo=`${app.replace(/\/$/,'')}/auth/callback?next=/reset-password`;
  const r=await fetch(`${url.replace(/\/$/,'')}/auth/v1/recover`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:String(email||'').trim().toLowerCase(),redirect_to:redirectTo,code_challenge:challenge,code_challenge_method:'s256'}),cache:'no-store'});
  if(!r.ok){const d=await r.json().catch(()=>({}));return NextResponse.json({error:d?.msg||'Unable to send reset email'},{status:r.status});}
  const response=NextResponse.json({ok:true});
  response.cookies.set(googleVerifierCookie,verifier,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:3600});
  return response;
 }catch{return NextResponse.json({error:'Unable to send reset email'},{status:400})}
}
