import { cookies } from 'next/headers';
import { supabaseRest } from './supabase-rest';

const COOKIE='bb_session';
const STATE_COOKIE='bb_google_state';
const VERIFIER_COOKIE='bb_google_verifier';

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
  const p=rows?.[0];
  return {id:auth.id,email:auth.email||p?.email,name:p?.name||auth.user_metadata?.full_name||auth.user_metadata?.name||null,role:p?.role||'user',emailVerified:auth.email_confirmed_at?new Date(auth.email_confirmed_at):null,passwordHash:null,profile:p||null};
}
export async function requireUser(){const u=await getSessionUser();if(!u)throw new Error('UNAUTHORIZED');return u}
export async function requireAdmin(){const u=await requireUser();if(u.role!=='admin')throw new Error('FORBIDDEN');return u}
export async function hashPassword(p:string){return p}
export async function verifyPassword(p:string,h:string){return false}
export const sessionCookie=COOKIE;
export const googleStateCookie=STATE_COOKIE;
export const googleVerifierCookie=VERIFIER_COOKIE;

export function setSessionCookie(response:Response,accessToken:string,refreshToken?:string){
  const r=response as any; r.cookies.set(COOKIE,accessToken,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
  if(refreshToken) r.cookies.set(`${COOKIE}_refresh`,refreshToken,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
}
