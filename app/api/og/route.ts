import { ImageResponse } from 'next/og';
import { createElement as h } from 'react';
export const runtime='edge';
export async function GET(req:Request){
 const u=new URL(req.url), slug=u.searchParams.get('slug')||'';
 let c:any={};
 try{
  const base=process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,''); const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(base&&key){const r=await fetch(`${base}/rest/v1/websites?select=content&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`},cache:'no-store'});const rows=await r.json();c=rows?.[0]?.content||{};}
 }catch{}
 return new ImageResponse(
  h('div',{style:{width:'1200px',height:'630px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',background:'linear-gradient(135deg,#111827,#831843)',color:'white',fontFamily:'sans-serif',padding:'70px',textAlign:'center'}},
   h('div',{style:{fontSize:34,opacity:.85}},'🎂 Birthday Builder'),
   h('div',{style:{fontSize:68,fontWeight:800,marginTop:25}},c.greeting||'Happy Birthday'),
   h('div',{style:{fontSize:40,marginTop:18}},`${c.name||'Someone special'} 💖`),
   h('div',{style:{fontSize:25,marginTop:28,opacity:.8}},c.heroSubtitle||'A birthday experience made with love.')
  ),
  {width:1200,height:630}
 );
}
