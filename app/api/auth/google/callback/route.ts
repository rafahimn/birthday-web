import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {googleStateCookie,googleVerifierCookie,setSessionCookie} from '@/lib/auth';
import {supabaseRest} from '@/lib/supabase-rest';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:Request){
 try{
  const u=new URL(req.url),code=u.searchParams.get('code'),state=u.searchParams.get('state');const c=cookies(),saved=c.get(googleStateCookie)?.value,verifier=c.get(googleVerifierCookie)?.value;
  if(!code||!state||!saved||state!==saved||!verifier)return NextResponse.redirect(new URL('/login?error=google_invalid_state',req.url));
  const supabase=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,app=process.env.NEXT_PUBLIC_APP_URL||u.origin;if(!supabase||!key)return NextResponse.redirect(new URL('/login?error=supabase_not_configured',req.url));
  const r=await fetch(`${supabase.replace(/\/$/,'')}/auth/v1/token?grant_type=pkce`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({auth_code:code,code_verifier:verifier}),cache:'no-store'});
  const d=await r.json();if(!r.ok||!d.access_token)return NextResponse.redirect(new URL('/login?error=google_token_failed',req.url));
  const authUser=d.user; if(!authUser?.id||!authUser.email)return NextResponse.redirect(new URL('/login?error=google_profile_failed',req.url));
  await supabaseRest('profiles',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:authUser.id,email:authUser.email,name:authUser.user_metadata?.full_name||authUser.user_metadata?.name||authUser.email.split('@')[0],avatar_url:authUser.user_metadata?.avatar_url||authUser.user_metadata?.picture||null})}).catch(()=>{});
  const response=NextResponse.redirect(new URL('/dashboard',app));setSessionCookie(response,d.access_token,d.refresh_token);response.cookies.set(googleStateCookie,'',{httpOnly:true,path:'/',maxAge:0});response.cookies.set(googleVerifierCookie,'',{httpOnly:true,path:'/',maxAge:0});return response;
 }catch{return NextResponse.redirect(new URL('/login?error=google_login_failed',req.url))}
}
