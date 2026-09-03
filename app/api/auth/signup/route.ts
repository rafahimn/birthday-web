import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {signupSchema} from '@/lib/validation';
import {supabaseRest} from '@/lib/supabase-rest';
import {setSessionCookie,googleVerifierCookie} from '@/lib/auth';
function b64(b:Buffer){return b.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
export const runtime='nodejs';
export async function POST(req:Request){try{
 const raw=await req.json(); const v=signupSchema.parse(raw); const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,app=process.env.NEXT_PUBLIC_APP_URL||new URL(req.url).origin;
 if(!url||!key)return NextResponse.json({error:'Supabase Auth is not configured'},{status:500});
 const verifier=b64(crypto.randomBytes(32)),challenge=b64(crypto.createHash('sha256').update(verifier).digest());
 const r=await fetch(`${url.replace(/\/$/,'')}/auth/v1/signup`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:v.email.toLowerCase(),password:v.password,data:{full_name:v.name},code_challenge:challenge,code_challenge_method:'s256',email_redirect_to:`${app.replace(/\/$/,'')}/auth/callback`}),cache:'no-store'});
 const data=await r.json(); if(!r.ok)return NextResponse.json({error:data?.msg||data?.message||'Unable to create account'},{status:r.status});

 // Member approval: admins and people who signed up through a valid invite
 // link skip the queue. Everyone else starts as pending — whether that
 // actually blocks them from building yet is decided at creation-time by
 // the admin's approval-system toggle, not here.
 const isAdmin=(process.env.ADMIN_EMAIL||'').trim().toLowerCase()===v.email.toLowerCase();
 let approved=isAdmin;
 if(!approved && typeof raw?.invite==='string' && raw.invite){
  const tok=await supabaseRest<any[]>(`settings?select=value&key=eq.signup_invite_token&limit=1`).catch(()=>[]);
  const expected=tok?.[0]?.value?.token;
  if(expected && expected===raw.invite) approved=true;
 }

 if(data?.user?.id) await supabaseRest('profiles',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:data.user.id,email:data.user.email,name:v.name,role:isAdmin?'admin':'user',approved})}).catch(()=>{});
 const response=NextResponse.json({ok:true,requiresEmailVerification:!data?.session});
 if(data?.session?.access_token)setSessionCookie(response,data.session.access_token,data.session.refresh_token); else response.cookies.set(googleVerifierCookie,verifier,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:3600});
 return response;
}catch(e:any){return NextResponse.json({error:e?.issues?.[0]?.message||e?.message||'Invalid request'},{status:400})}}
