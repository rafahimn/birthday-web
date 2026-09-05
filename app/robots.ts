import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/builder', '/dashboard', '/settings'] },
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
