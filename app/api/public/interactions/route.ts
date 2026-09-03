import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export const runtime='nodejs';
export const dynamic='force-dynamic';

async function site(slug:string){ return db.website.findFirst({where:{slug,status:'published'}}); }

export async function GET(req:Request){
  const u=new URL(req.url), slug=u.searchParams.get('slug')||'', recipientKey=u.searchParams.get('recipient')||'';
  if(!slug) return NextResponse.json({error:'slug required'},{status:400});
  const s=await site(slug); if(!s) return NextResponse.json({error:'Not found'},{status:404});
  const recipients=Array.isArray(s.content?.recipients)?s.content.recipients:[];
  const recipient=recipientKey?recipients.find((r:any)=>String(r.id)===recipientKey):null;
  const wishes=await db.collaborativeWish.findMany({where:{websiteId:s.id,approved:true},orderBy:{createdAt:'desc'},take:30}).catch(()=>[]);
  const reactions=await db.reaction.findMany({where:{websiteId:s.id},orderBy:{createdAt:'desc'},take:200}).catch(()=>[]);
  const counts=reactions.reduce((a:any,r:any)=>(a[r.emoji]=(a[r.emoji]||0)+1,a),{});
  return NextResponse.json({recipient:recipient||null,wishes,reactionCounts:counts});
}

export async function POST(req:Request){
  try{
    const b=await req.json();
    const s=await site(String(b.slug||'')); if(!s)return NextResponse.json({error:'Not found'},{status:404});
    const recipients=Array.isArray(s.content?.recipients)?s.content.recipients:[];
    const recipient=recipients.find((r:any)=>String(r.id)===String(b.recipientId));
    const recipientId=recipient?.id||null;
    const type=String(b.type||'view');
    if(type==='wish'){
      const name=String(b.name||'Anonymous').trim().slice(0,80), message=String(b.message||'').trim().slice(0,1000);
      if(!message)return NextResponse.json({error:'Message required'},{status:400});
      const row=await db.collaborativeWish.create({data:{websiteId:s.id,recipientId:null,authorName:name,message,approved:true}}); await db.recipientEvent.create({data:{websiteId:s.id,recipientId:null,type:'wish',metadata:{recipientKey:recipient?.id||b.recipientId||null}}}).catch(()=>{});
      return NextResponse.json({ok:true,row});
    }
    if(type==='reaction'){
      const allowed=['❤️','😍','🎉','🥳','🎂','💖','🔥','👏'];
      const emoji=String(b.emoji||'❤️'); if(!allowed.includes(emoji))return NextResponse.json({error:'Invalid reaction'},{status:400});
      const row=await db.reaction.create({data:{websiteId:s.id,recipientId:null,emoji}}); await db.recipientEvent.create({data:{websiteId:s.id,recipientId:null,type:'reaction',metadata:{recipientKey:recipient?.id||b.recipientId||null,emoji}}}).catch(()=>{});
      return NextResponse.json({ok:true,row});
    }
    const row=await db.recipientEvent.create({data:{websiteId:s.id,recipientId:null,type,metadata:{recipientKey:recipientId||b.recipientId||null,referrer:b.referrer||null,device:b.device||null}}});
    return NextResponse.json({ok:true,row});
  }catch(e){ console.error(e); return NextResponse.json({error:'Interaction failed'},{status:500}); }
}
