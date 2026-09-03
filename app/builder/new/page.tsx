export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import {redirect} from 'next/navigation';import {getSessionUser} from '@/lib/auth';import {db} from '@/lib/db';
export default async function New(){const u=await getSessionUser();if(!u)redirect('/login');const s=await db.website.create({data:{userId:u.id,slug:`birthday-${Date.now()}`,title:'My Birthday Website',content:{}}});redirect(`/builder/${s.id}`)}
