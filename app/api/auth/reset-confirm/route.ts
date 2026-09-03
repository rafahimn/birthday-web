import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {resetPasswordSchema} from '@/lib/validation';
import {sessionCookie} from '@/lib/auth';
export const runtime='nodejs';
export async function POST(req:Request){
 try{
  const v=resetPasswordSchema.parse(await req.json());
  const token=cookies().get(sessionCookie)?.value;
  if(!token)return NextResponse.json({error:'Your reset link has expired. Please request a new one.'},{status:401});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return NextResponse.json({error:'Supabase Auth is not configured'},{status:500});
  const r=await fetch(`${url.replace(/\/$/,'')}/auth/v1/user`,{method:'PUT',headers:{apikey:key,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({password:v.password}),cache:'no-store'});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)return NextResponse.json({error:d?.msg||d?.error_description||'Could not update your password'},{status:r.status});
  return NextResponse.json({ok:true});
 }catch(e:any){return NextResponse.json({error:e?.issues?.[0]?.message||'Invalid request'},{status:400})}
}
