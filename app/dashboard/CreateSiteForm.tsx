"use client";

import { useState, useTransition } from "react";
import { createSite } from "@/lib/actions";
import type { Template } from "@/lib/types";

export default function CreateSiteForm({ templates }: { templates: Template[] }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        + নতুন Site বানাও
      </button>
    );
  }

  return (
    <form
      action={(fd) => startTransition(() => createSite(fd))}
      className="max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-sm"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-stone-600">যাকে জন্য বানাচ্ছো তার নাম</span>
        <input name="recipient_name" required className="input" placeholder="যেমন: Natasha" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-stone-600">
          লিংক (slug) — খালি রাখলে নাম থেকে অটো বানাবে
        </span>
        <input name="slug" className="input" placeholder="natashas-birthday" />
      </label>
      {templates.length > 0 && (
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-stone-600">Template (না চাইলে খালি রাখো)</span>
          <select name="template_id" className="input" defaultValue="">
            <option value="">— কোনো template ছাড়া —</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="flex gap-2">
        <button disabled={pending} className="btn-primary">
          {pending ? "বানানো হচ্ছে..." : "Create"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full border-2 border-stone-200 px-4 py-1.5 text-sm font-semibold text-stone-500 hover:bg-stone-50">
          Cancel
        </button>
      </div>
    </form>
  );
}
