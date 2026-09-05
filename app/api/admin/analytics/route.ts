export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const [users, sites, events] = await Promise.all([
    db.user.findMany({}),
    db.website.findMany({}),
    db.analyticsEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 1000 }),
  ]);
  const totalViews = sites.reduce((sum: number, s: any) => sum + Number(s.views || 0), 0);
  const published = sites.filter((s: any) => s.status === 'published').length;
  const draft = sites.filter((s: any) => s.status === 'draft').length;
  const archived = sites.filter((s: any) => s.status === 'archived').length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const eventsLast7Days = events.filter((e: any) => new Date(e.createdAt).getTime() >= weekAgo).length;
  const byDay: Record<string, number> = {};
  for (const e of events) {
    const day = new Date(e.createdAt).toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }
  const dailyEvents = Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0])).slice(-14).map(([date, count]) => ({ date, count }));

  return NextResponse.json({
    totalUsers: users.length,
    totalWebsites: sites.length,
    published, draft, archived,
    totalViews,
    eventsLast7Days,
    dailyEvents,
  });
}
