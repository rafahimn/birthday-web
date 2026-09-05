import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '') || 'http://localhost:3000';
  const staticPaths = ['', '/demo', '/templates', '/features', '/pricing', '/faq', '/contact'];
  const entries: MetadataRoute.Sitemap = staticPaths.map(p => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.6 }));
  try {
    const sites = await db.website.findMany({ where: { status: 'published' }, select: { slug: true, updatedAt: true } });
    for (const s of sites) entries.push({ url: `${base}/site/${s.slug}`, lastModified: s.updatedAt || undefined, changeFrequency: 'monthly', priority: 0.4 });
  } catch {}
  return entries;
}
