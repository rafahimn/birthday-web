export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import {NextResponse} from 'next/server';import {db} from '@/lib/db';import {sendPasswordResetNotice} from '@/lib/mail';
export async function POST(req:Request){try{const {email}=await req.json();const normalized=String(email||'').trim().toLowerCase();if(normalized){const u=await db.user.findUnique({where:{email:normalized}});if(u){await db.notification.create({data:{userId:u.id,title:'Password reset requested',message:'A password reset request was received.'}}).catch(()=>{});await sendPasswordResetNotice(u.email).catch(()=>{});}}return NextResponse.json({ok:true});}catch{return NextResponse.json({ok:true});}}
