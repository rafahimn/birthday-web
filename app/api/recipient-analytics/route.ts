import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {db} from '@/lib/db';
export const runtime='nodejs';
export async function GET(req:Request){
 const u=await getSessionUser();if(!u)return NextResponse.json({error:'Unauthorized'},{status:401});
 const id=new URL(req.url).searchParams.get('websiteId');if(!id)return NextResponse.json({error:'websiteId required'},{status:400});
 const site=await db.website.findFirst({where:{id,userId:u.id}});if(!site)return NextResponse.json({error:'Not found'},{status:404});
 const events=await db.recipientEvent.findMany({where:{websiteId:id},orderBy:{createdAt:'desc'},take:5000});
 const by:any={};
 for(const e of events){const key=e.metadata?.recipientKey||'general';by[key]??={recipientId:key,views:0,shares:0,reactions:0,wishes:0,events:0};by[key].events++;if(e.type==='view')by[key].views++;if(String(e.type).includes('share'))by[key].shares++;if(e.type==='reaction')by[key].reactions++;if(e.type==='wish')by[key].wishes++;}
 return NextResponse.json({items:Object.values(by)});
}
