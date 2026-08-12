"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateSecret } from "@/lib/actions";
import type { SiteSettings } from "@/lib/types";
import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";

export default function SecretForm({ settings }: { settings: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(settings.secret_photo_url ?? "");

  return (
    <form
      action={(fd) => {
        setSaved(false);
        fd.set("secret_photo_url", photoUrl);
        startTransition(async () => {
          await updateSecret(fd);
          setSaved(true);
        });
      }}
      className="max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-sm"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-stone-600">Secret photo</span>
        <div className="flex items-center gap-3">
          <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="input" placeholder="Image URL" />
          <CloudinaryUploadButton onUploaded={setPhotoUrl} label="Upload" />
        </div>
      </label>

      {photoUrl && (
        <div className="relative h-56 w-full max-w-xs overflow-hidden rounded-2xl border">
          <Image src={photoUrl} alt="preview" fill className="object-cover" />
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-stone-600">Button label</span>
        <input name="secret_button_label" defaultValue={settings.secret_button_label} className="input" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-stone-600">Button link</span>
        <input name="secret_button_link" defaultValue={settings.secret_button_link ?? ""} className="input" placeholder="https://instagram.com/..." />
      </label>

      <div className="flex items-center gap-4">
        <button disabled={pending} className="btn-primary">{pending ? "Saving..." : "Save changes"}</button>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved ✓</span>}
      </div>
    </form>
  );
}
