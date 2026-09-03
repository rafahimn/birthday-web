import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
export const runtime='nodejs';
export async function GET(){const u=await getSessionUser();if(!u)return NextResponse.json({error:'Unauthorized'},{status:401});return NextResponse.json(u.profile||{});}
export async function PUT(req:Request){
 const u=await getSessionUser();if(!u)return NextResponse.json({error:'Unauthorized'},{status:401});
 const b=await req.json(); const data={name:String(b.name||u.name||'').slice(0,100),bio:String(b.bio||'').slice(0,500),avatarUrl:String(b.avatarUrl||'').slice(0,1000)};
 const p=await db.profile.update({where:{id:u.id},data});
 return NextResponse.json(p);
}
