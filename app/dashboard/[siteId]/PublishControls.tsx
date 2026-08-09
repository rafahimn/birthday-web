"use client";

import { useState, useTransition } from "react";
import { togglePublished, updateSlug, deleteSite } from "@/lib/actions";
import type { Site } from "@/lib/types";

export default function PublishControls({ site }: { site: Site }) {
  const [pending, startTransition] = useTransition();
  const [slugSaved, setSlugSaved] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/s/${site.slug}` : `/s/${site.slug}`;

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-600">Status</p>
          <p className={`text-sm ${site.published ? "text-emerald-600" : "text-stone-400"}`}>
            {site.published ? "Live — লিংক দিয়ে সবাই দেখতে পাবে" : "Draft — লিংক এখনো কাজ করবে না"}
          </p>
        </div>
        <button
          disabled={pending}
          onClick={() => startTransition(() => togglePublished(site.id, !site.published))}
          className={`rounded-full px-4 py-2 text-sm font-bold text-white shadow ${
            site.published ? "bg-stone-400" : "bg-emerald-500"
          }`}
        >
          {site.published ? "Unpublish" : "Publish"}
        </button>
      </div>

      <form
        action={(fd) => {
          setSlugError(null);
          setSlugSaved(false);
          startTransition(async () => {
            try {
              await updateSlug(site.id, fd);
              setSlugSaved(true);
            } catch (e) {
              setSlugError(e instanceof Error ? e.message : "কিছু একটা ভুল হয়েছে");
            }
          });
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="flex-1">
          <span className="mb-1 block text-sm font-medium text-stone-600">শেয়ার লিংক</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-400">/s/</span>
            <input name="slug" defaultValue={site.slug} className="input" />
          </div>
        </label>
        <button disabled={pending} className="btn-primary shrink-0 text-sm">Save</button>
      </form>
      {slugError && <p className="text-sm text-red-600">{slugError}</p>}
      {slugSaved && <p className="text-sm font-medium text-emerald-600">Saved ✓</p>}

      {site.published && (
        <p className="rounded-xl bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-700">
          লাইভ লিংক: <span className="font-semibold">{shareUrl}</span>
        </p>
      )}

      <div className="border-t border-stone-100 pt-4">
        {!confirmingDelete ? (
          <button onClick={() => setConfirmingDelete(true)} className="btn-danger">
            Delete this site
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-600">নিশ্চিত? এটা ফেরত আনা যাবে না।</span>
            <button
              disabled={pending}
              onClick={() => startTransition(() => deleteSite(site.id))}
              className="btn-danger"
            >
              হ্যাঁ, Delete করো
            </button>
            <button onClick={() => setConfirmingDelete(false)} className="text-sm text-stone-500">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
