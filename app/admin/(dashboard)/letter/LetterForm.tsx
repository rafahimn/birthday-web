"use client";

import { useState, useTransition } from "react";
import { updateLetter } from "@/lib/actions";
import type { SiteSettings } from "@/lib/types";

export default function LetterForm({ settings }: { settings: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={(fd) => {
        setSaved(false);
        startTransition(async () => {
          await updateLetter(fd);
          setSaved(true);
        });
      }}
      className="max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-sm"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-stone-600">Letter title</span>
        <input name="letter_title" defaultValue={settings.letter_title} className="input" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-stone-600">Letter content</span>
        <textarea
          name="letter_content"
          defaultValue={settings.letter_content}
          rows={8}
          className="input"
        />
      </label>

      <div className="flex items-center gap-4">
        <button disabled={pending} className="btn-primary">{pending ? "Saving..." : "Save changes"}</button>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved ✓</span>}
      </div>
    </form>
  );
}
