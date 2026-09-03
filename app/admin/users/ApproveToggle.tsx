'use client';
import { useState } from 'react';

export default function ApproveToggle({ userId, initialApproved }: { userId: string; initialApproved: boolean }) {
  const [approved, setApproved] = useState(initialApproved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ approved: !approved }),
      });
      if (r.ok) setApproved(!approved);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-xs font-semibold ${approved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}
    >
      {loading ? '…' : approved ? 'Approved' : 'Pending — Approve'}
    </button>
  );
}
