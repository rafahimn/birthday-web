import MasterTemplate from '@/components/template/MasterTemplate';
import { db } from '@/lib/db';
import { defaultContent } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function DemoPage({ searchParams }: { searchParams?: { site?: string } }) {
  const slug = searchParams?.site;
  let content: any = undefined;
  if (slug) {
    const site = await db.demoSite.findFirst({ where: { slug, active: true } }).catch(() => null);
    if (site?.content && Object.keys(site.content).length) content = { ...defaultContent, ...site.content };
  }
  return <main className="min-h-screen bg-black"><MasterTemplate demo content={content} /></main>;
}
