'use client';

import { useMemo } from 'react';
import type { BirthdayContent } from '@/lib/types';

type Props = {
  data?: { name?: string; age?: number; month?: number; day?: number; hour?: number; minute?: number };
  content?: BirthdayContent;
};

function contentToData(content?: BirthdayContent) {
  if (!content) return {};
  const result: Props['data'] = { name: content.name };
  if (content.birthday) {
    const d = new Date(content.birthday);
    if (!Number.isNaN(d.getTime())) {
      result.month = d.getMonth();
      result.day = d.getDate();
    }
  }
  return result;
}

export default function MasterTemplate({ data, content }: Props) {
  const resolved = useMemo(() => ({ ...contentToData(content), ...data }), [content, data]);
  const src = useMemo(() => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(resolved)) {
      if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
    }
    return `/master-template.html${p.toString() ? `?${p.toString()}` : ''}`;
  }, [resolved]);

  return (
    <iframe
      title="Birthday Master Template"
      src={src}
      className="h-full min-h-[760px] w-full border-0"
      allow="autoplay; microphone; camera; fullscreen"
      sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
    />
  );
}

export { MasterTemplate };
