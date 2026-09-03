export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import {notFound} from 'next/navigation';import {db} from '@/lib/db';import {MasterTemplate} from '@/components/template/MasterTemplate';import {defaultContent} from '@/lib/types';
export default async function Site({params}:{params:{slug:string}}){const s=await db.website.findUnique({where:{slug:params.slug}});if(!s||s.status!=='published')return notFound();await db.website.update({where:{id:s.id},data:{views:{increment:1}}});await db.analyticsEvent.create({data:{websiteId:s.id,type:'view',path:`/site/${params.slug}`}});return <MasterTemplate content={{...defaultContent,...(s.content as any)}} slug={s.slug}/>}
