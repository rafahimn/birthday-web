"use client";

import { useState, useTransition } from "react";
import { regenerateInviteLink } from "@/lib/adminActions";

export default function InviteLinkCard({ baseUrl, token }: { baseUrl: string; token: string }) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const link = `${baseUrl}/signup?invite=${token}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — user can still select & copy manually
    }
  }

  return (
    <section className="mb-10 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-1 font-display text-xl text-fuchsia-700">Invite Link</h2>
      <p className="mb-4 text-sm text-stone-500">
        এই লিংক দিয়ে যে কেউ account খুললে সাথে সাথেই approved হয়ে যাবে — admin approval লাগবে না।
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="input flex-1 text-sm text-stone-600"
        />
        <button onClick={copyLink} className="btn-primary shrink-0">
          {copied ? "কপি হয়েছে ✓" : "Copy"}
        </button>
        <button
          disabled={pending}
          onClick={() => {
            if (confirm("আগের লিংকটা আর কাজ করবে না। নতুন লিংক বানাতে চাও?")) {
              startTransition(() => regenerateInviteLink());
            }
          }}
          className="shrink-0 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-semibold text-stone-500 hover:bg-stone-50"
        >
          নতুন লিংক বানাও
        </button>
      </div>
    </section>
  );
}
