import { prisma } from "@/lib/prisma";
import { generateSiteHtml } from "@/lib/templateEngine";
import { SiteConfig } from "@/types/site-config";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const site = await prisma.site.findUnique({ where: { slug: params.slug } });

  if (!site || !site.published) {
    return new Response("<h1>This birthday site was not found or is no longer available.</h1>", {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }

  const config = JSON.parse(site.config) as SiteConfig;
  const html = generateSiteHtml(config);

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
