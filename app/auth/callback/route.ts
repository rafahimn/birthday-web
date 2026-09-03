import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {googleVerifierCookie,setSessionCookie} from '@/lib/auth';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:Request){
 const u=new URL(req.url),code=u.searchParams.get('code'),verifier=cookies().get(googleVerifierCookie)?.value;
 if(!code)return NextResponse.redirect(new URL('/login?error=auth_callback_failed',u.origin));
 const supabase=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!supabase||!key)return NextResponse.redirect(new URL('/login?error=supabase_not_configured',u.origin));
 const r=await fetch(`${supabase.replace(/\/$/,'')}/auth/v1/token?grant_type=pkce`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({auth_code:code,code_verifier:verifier||''}),cache:'no-store'});
 const d=await r.json().catch(()=>({}));
 if(!r.ok||!d.access_token)return NextResponse.redirect(new URL('/login?error=auth_callback_failed',u.origin));
 const response=NextResponse.redirect(new URL('/dashboard',u.origin));setSessionCookie(response,d.access_token,d.refresh_token);response.cookies.set(googleVerifierCookie,'',{httpOnly:true,path:'/',maxAge:0});return response;
}
