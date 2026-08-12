"use client";

import { useTransition } from "react";
import { addReason, deleteReason, updateReason } from "@/lib/actions";
import type { Reason } from "@/lib/types";

export default function ReasonsManager({ reasons }: { reasons: Reason[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="max-w-2xl space-y-6">
      <form
        action={(fd) => startTransition(async () => { await addReason(fd); (document.getElementById("reason-form") as HTMLFormElement)?.reset(); })}
        id="reason-form"
        className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-end"
      >
        <label className="flex-1">
          <span className="mb-1 block text-sm font-medium text-stone-600">নতুন reason</span>
          <input name="text" required className="input" placeholder="You're kind, funny, and..." />
        </label>
        <label className="w-24">
          <span className="mb-1 block text-sm font-medium text-stone-600">Emoji</span>
          <input name="emoji" defaultValue="💖" className="input" />
        </label>
        <button disabled={pending} className="btn-primary shrink-0">Add</button>
      </form>

      <div className="space-y-3">
        {reasons.map((r) => (
          <ReasonRow key={r.id} reason={r} />
        ))}
        {reasons.length === 0 && <p className="text-sm text-stone-400">এখনো কোনো reason যোগ করা হয়নি।</p>}
      </div>
    </div>
  );
}

function ReasonRow({ reason }: { reason: Reason }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => updateReason(reason.id, fd))}
      className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
    >
      <input name="emoji" defaultValue={reason.emoji} className="input sm:w-16" />
      <input name="text" defaultValue={reason.text} className="input flex-1" />
      <div className="flex gap-2">
        <button disabled={pending} type="submit" className="btn-primary text-sm">Save</button>
        <button
          type="button"
          onClick={() => startTransition(() => deleteReason(reason.id))}
          className="btn-danger"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
