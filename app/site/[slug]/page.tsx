import MasterTemplate from '@/components/template/MasterTemplate';
import { notFound } from 'next/navigation';
import { getPublishedSite } from '@/lib/supabase-rest';
export const dynamic = 'force-dynamic';
export default async function PublishedSite({params}:{params:{slug:string}}){
  const site=await getPublishedSite(params.slug); if(!site) notFound();
  const c=site.content||{};
  return <main className="min-h-screen bg-black"><MasterTemplate data={{
    name:c.name,age:c.age,month:c.month,day:c.day,hour:c.hour,minute:c.minute
  }}/></main>;
}
