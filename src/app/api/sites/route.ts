import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { defaultSiteConfig } from "@/types/site-config";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sites = await prisma.site.findMany({
    where: { ownerId: (session.user as any).id },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(sites);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title: string = body.title || "My Birthday Site";

  const config = { ...defaultSiteConfig, ...(body.config || {}) };
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${nanoid(6)}`;

  const site = await prisma.site.create({
    data: {
      slug,
      title,
      config: JSON.stringify(config),
      ownerId: (session.user as any).id
    }
  });

  return NextResponse.json(site);
}
