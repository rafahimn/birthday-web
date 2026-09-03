import {NextResponse} from 'next/server';
import {loginSchema} from '@/lib/validation';
import {setSessionCookie} from '@/lib/auth';
import {supabaseRest} from '@/lib/supabase-rest';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export const runtime='nodejs';
export async function POST(req:Request){
 try{
  const v=loginSchema.parse(await req.json());
  const email=v.email.toLowerCase();
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return NextResponse.json({error:'Supabase Auth is not configured'},{status:500});

  // Brute-force lockout: look up the profile row by email (best-effort — if
  // this fails for any reason we still fall through to the normal password
  // check rather than blocking a legitimate login on a lockout-tracking bug).
  let profile:any=null;
  try{
   const rows=await supabaseRest<any[]>(`profiles?select=id,failed_login_attempts,login_locked_until&email=eq.${encodeURIComponent(email)}&limit=1`);
   profile=rows?.[0]||null;
  }catch{}

  if(profile?.login_locked_until && new Date(profile.login_locked_until).getTime()>Date.now()){
   const minutesLeft=Math.ceil((new Date(profile.login_locked_until).getTime()-Date.now())/60000);
   return NextResponse.json({error:`Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft===1?'':'s'}.`},{status:429});
  }

  const r=await fetch(`${url.replace(/\/$/,'')}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email,password:v.password}),cache:'no-store'});
  const d=await r.json();

  if(!r.ok){
   if(profile){
    const attempts=(profile.failed_login_attempts||0)+1;
    const locked=attempts>=MAX_ATTEMPTS;
    await supabaseRest('profiles',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:profile.id,failed_login_attempts:locked?0:attempts,login_locked_until:locked?new Date(Date.now()+LOCK_MINUTES*60000).toISOString():null})}).catch(()=>{});
    if(locked)return NextResponse.json({error:`Too many failed attempts. Try again in ${LOCK_MINUTES} minutes.`},{status:429});
   }
   return NextResponse.json({error:d?.error_description||d?.msg||'Invalid email or password'},{status:401});
  }

  if(profile && (profile.failed_login_attempts||profile.login_locked_until)){
   await supabaseRest('profiles',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:profile.id,failed_login_attempts:0,login_locked_until:null})}).catch(()=>{});
  }

  const response=NextResponse.json({ok:true});setSessionCookie(response,d.access_token,d.refresh_token);return response;
 }catch{return NextResponse.json({error:'Invalid request'},{status:400})}
}
