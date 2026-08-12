import { generateSiteHtml } from "@/lib/templateEngine";
import { demoConfig } from "@/lib/demoConfig";

export async function GET() {
  const html = generateSiteHtml(demoConfig);
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
