import {NextResponse} from 'next/server';
import {loginSchema} from '@/lib/validation';
import {setSessionCookie} from '@/lib/auth';
export const runtime='nodejs';
export async function POST(req:Request){
 try{
  const v=loginSchema.parse(await req.json());
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return NextResponse.json({error:'Supabase Auth is not configured'},{status:500});
  const r=await fetch(`${url.replace(/\/$/,'')}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:v.email.toLowerCase(),password:v.password}),cache:'no-store'});
  const d=await r.json();if(!r.ok)return NextResponse.json({error:d?.error_description||d?.msg||'Invalid email or password'},{status:401});
  const response=NextResponse.json({ok:true});setSessionCookie(response,d.access_token,d.refresh_token);return response;
 }catch{return NextResponse.json({error:'Invalid request'},{status:400})}
}
