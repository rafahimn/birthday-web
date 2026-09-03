import MasterTemplate from '@/components/template/MasterTemplate';
import { notFound } from 'next/navigation';
import { getPublishedSite, supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function PublishedSite({ params }: { params: { slug: string } }) {
  const site = await getPublishedSite(params.slug);
  if (!site) notFound();
  const c = site.content || {};
  try {
    await supabaseRest(`rpc/increment_website_views`, {
      method: 'POST',
      body: JSON.stringify({ p_website_id: site.id }),
    });
  } catch (error) {
    console.error('view increment failed', error);
  }
  return <main className="min-h-screen bg-black"><MasterTemplate content={c} /></main>;
}
