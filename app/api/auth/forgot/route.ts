import {NextResponse} from 'next/server';
export async function POST(req:Request){
 try{
  const {email}=await req.json(); const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,app=process.env.NEXT_PUBLIC_APP_URL;
  if(!url||!key)return NextResponse.json({error:'Supabase Auth is not configured'},{status:500});
  const r=await fetch(`${url.replace(/\/$/,'')}/auth/v1/recover`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:String(email||'').trim().toLowerCase(),redirect_to:`${app||'http://localhost:3000'}/auth/callback`}),cache:'no-store'});
  if(!r.ok){const d=await r.json().catch(()=>({}));return NextResponse.json({error:d?.msg||'Unable to send reset email'},{status:r.status});}
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'Unable to send reset email'},{status:400})}
}
