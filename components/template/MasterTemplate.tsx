'use client';

import { useMemo } from 'react';

type Props = {
  data?: { name?: string; age?: number; month?: number; day?: number; hour?: number; minute?: number };
};

export default function MasterTemplate({ data = {} }: Props) {
  const src = useMemo(() => {
    const p = new URLSearchParams();
    for (const [k,v] of Object.entries(data)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
    return `/master-template.html${p.toString() ? `?${p}` : ''}`;
  }, [data]);

  return <iframe title="Birthday Master Template" src={src}
    className="h-full min-h-[760px] w-full border-0"
    allow="autoplay; microphone; camera; fullscreen"
    sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts" />;
}
