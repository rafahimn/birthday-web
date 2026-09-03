export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { templateCatalog } from '@/lib/templates';

export async function GET() {
  try {
    const existing = await db.template.findMany({ where: { active: true } });
    if (existing.length) return NextResponse.json(existing);
  } catch {
    // Fall back to the built-in catalog until Supabase is configured.
  }
  return NextResponse.json(templateCatalog.map((x, i) => ({ ...x, id: String(i), active: true, config: {} })));
}
