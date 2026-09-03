import MasterTemplate from '@/components/template/MasterTemplate';
import { notFound } from 'next/navigation';
import { getPublishedSite, supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const site = await getPublishedSite(params.slug);
  const c:any = site?.content || {};
  const base = process.env.NEXT_PUBLIC_APP_URL || '';
  return { title: c.seoTitle || c.greeting || 'Happy Birthday', description: c.seoDescription || 'A special birthday website.', openGraph: { title: c.seoTitle || c.greeting || 'Happy Birthday', description: c.seoDescription || '', images: [{ url: `${base}/api/og?slug=${encodeURIComponent(params.slug)}` }] } };
}

export default async function PublishedSite({ params, searchParams }: { params: { slug: string }, searchParams?: { recipient?: string; to?: string } }) {
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
  return <main className="min-h-screen bg-black"><MasterTemplate content={c} websiteSlug={params.slug} recipientId={searchParams?.recipient || searchParams?.to || ''} /></main>;
}
