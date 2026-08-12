import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireOwnedSite(id: string, userId: string) {
  const site = await prisma.site.findUnique({ where: { id } });
  if (!site || site.ownerId !== userId) return null;
  return site;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const site = await requireOwnedSite(params.id, (session.user as any).id);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(site);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const site = await requireOwnedSite(params.id, (session.user as any).id);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.site.update({
    where: { id: params.id },
    data: {
      title: body.title ?? site.title,
      published: typeof body.published === "boolean" ? body.published : site.published,
      config: body.config ? JSON.stringify(body.config) : site.config
    }
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const site = await requireOwnedSite(params.id, (session.user as any).id);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.site.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
