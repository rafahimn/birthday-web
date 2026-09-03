'use client';
import { useState } from 'react';

export default function SettingsPanel({
  initialEnabled,
  initialToken,
  appUrl,
}: {
  initialEnabled: boolean;
  initialToken: string | null;
  appUrl: string;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = token ? `${appUrl.replace(/\/$/, '')}/signup?invite=${token}` : null;

  async function toggleApproval() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ approvalEnabled: !enabled }),
      });
      const j = await r.json();
      if (r.ok) setEnabled(j.approvalEnabled);
    } finally {
      setLoading(false);
    }
  }

  async function regenerate() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ regenerateInvite: true }),
      });
      const j = await r.json();
      if (r.ok) setToken(j.inviteToken);
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold">Require admin approval before members can build</h2>
            <p className="mt-1 text-sm text-zinc-400">
              When on, a new member can log into their dashboard right away but can&apos;t create a website until you approve them under User Management.
            </p>
          </div>
          <button onClick={toggleApproval} disabled={loading} className={enabled ? 'btn' : 'btn2'}>
            {loading ? '…' : enabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold">Instant-access signup link</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Anyone who signs up through this link is approved automatically, even while approval is required above. Share it only with people you trust.
        </p>
        {inviteLink ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input readOnly value={inviteLink} className="flex-1 min-w-[240px]" />
            <button onClick={copy} className="btn2" type="button">{copied ? 'Copied!' : 'Copy'}</button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">No link generated yet.</p>
        )}
        <button onClick={regenerate} disabled={loading} className="btn2 mt-4">
          {loading ? '…' : inviteLink ? 'Regenerate link (invalidates the old one)' : 'Generate link'}
        </button>
      </div>
    </div>
  );
}
