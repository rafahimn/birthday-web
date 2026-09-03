import { cookies } from 'next/headers';
import { supabaseRest } from './supabase-rest';

const COOKIE='bb_session';
const STATE_COOKIE='bb_google_state';
const VERIFIER_COOKIE='bb_google_verifier';
const INVITE_COOKIE='bb_google_invite';

async function authFetch(path:string, init:RequestInit={}) {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key) throw new Error('Supabase Auth environment is not configured');
  const headers=new Headers(init.headers); headers.set('apikey',key); headers.set('Content-Type','application/json');
  const token=cookies().get(COOKIE)?.value; if(token) headers.set('Authorization',`Bearer ${token}`);
  const r=await fetch(`${url.replace(/\/$/,'')}/auth/v1/${path}`,{...init,headers,cache:'no-store'});
  if(!r.ok)return null; return r.json();
}

export async function getSessionUser(){
  const token=cookies().get(COOKIE)?.value;if(!token)return null;
  const auth=await authFetch('user'); if(!auth?.id)return null;
  const rows=await supabaseRest<any[]>(`profiles?select=*&id=eq.${encodeURIComponent(auth.id)}&limit=1`).catch(()=>[]);
  let p=rows?.[0];
  // Bootstrap: whoever signs up/logs in with the email in ADMIN_EMAIL is
  // treated as an admin, even if their profile row predates that setting.
  const adminEmail=process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail=(auth.email||p?.email||'').toLowerCase();
  if(adminEmail && userEmail && adminEmail===userEmail && p?.role!=='admin'){
    p={...(p||{id:auth.id,email:auth.email}),role:'admin'};
    await supabaseRest('profiles',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:auth.id,email:auth.email,role:'admin'})}).catch(()=>{});
  }
  return {id:auth.id,email:auth.email||p?.email,name:p?.name||auth.user_metadata?.full_name||auth.user_metadata?.name||null,role:p?.role||'user',approved:p?.approved!==false,emailVerified:auth.email_confirmed_at?new Date(auth.email_confirmed_at):null,passwordHash:null,profile:p||null};
}
export async function requireUser(){const u=await getSessionUser();if(!u)throw new Error('UNAUTHORIZED');return u}
export async function requireAdmin(){const u=await requireUser();if(u.role!=='admin')throw new Error('FORBIDDEN');return u}
// Member-approval gate: only blocks when an admin has BOTH turned the
// approval system on AND not approved this particular member yet. Flipping
// the setting off immediately unblocks everyone, regardless of their
// individual `approved` flag.
export async function isApprovalRequired(){
  const rows=await supabaseRest<any[]>(`settings?select=value&key=eq.approval_system&limit=1`).catch(()=>[]);
  return !!rows?.[0]?.value?.enabled;
}
export async function requireApprovedUser(){
  const u=await requireUser();
  if(u.role==='admin') return u;
  if(!u.approved && await isApprovalRequired()) throw new Error('PENDING_APPROVAL');
  return u;
}
export async function hashPassword(p:string){return p}
export async function verifyPassword(p:string,h:string){return false}
export const sessionCookie=COOKIE;
export const googleStateCookie=STATE_COOKIE;
export const googleVerifierCookie=VERIFIER_COOKIE;
export const googleInviteCookie=INVITE_COOKIE;

export function setSessionCookie(response:Response,accessToken:string,refreshToken?:string){
  const r=response as any; r.cookies.set(COOKIE,accessToken,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
  if(refreshToken) r.cookies.set(`${COOKIE}_refresh`,refreshToken,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
}
