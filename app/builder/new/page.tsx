export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import {redirect} from 'next/navigation';import {getSessionUser,isApprovalRequired} from '@/lib/auth';import {db} from '@/lib/db';
export default async function New(){
  const u=await getSessionUser();if(!u)redirect('/login');
  if(u.role!=='admin' && !u.approved && await isApprovalRequired())redirect('/dashboard?pending=1');
  const s=await db.website.create({data:{userId:u.id,slug:`birthday-${Date.now()}`,title:'My Birthday Website',content:{}}});
  redirect(`/builder/${s.id}`);
}
