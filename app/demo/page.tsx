export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { defaultContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import { db } from '@/lib/db';

export default async function Demo() {
  let content = defaultContent;
  try {
    const d = await db.demoSite.findFirst({ where: { active: true }, orderBy: { updatedAt: 'desc' } });
    if (d?.content && typeof d.content === 'object') {
      content = { ...defaultContent, ...(d.content as Partial<typeof defaultContent>) };
    }
  } catch {
    // Public demo remains usable when the database has not been configured yet.
  }
  return <MasterTemplate demo content={content} />;
}
