"use client";

import { useState, useTransition } from "react";
import { adminUpdateSiteContact, adminTogglePublished, adminDeleteSite } from "@/lib/adminActions";
import type { Site } from "@/lib/types";

export default function AdminSiteForm({ site }: { site: Site }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(site.published);

  function handleSubmit(formData: FormData) {
    setSaved(false);
    startTransition(async () => {
      await adminUpdateSiteContact(site.id, formData);
      setSaved(true);
    });
  }

  function handleTogglePublish() {
    const next = !published;
    setPublished(next);
    startTransition(() => adminTogglePublished(site.id, next));
  }

  function handleDelete() {
    if (!confirm(`"${site.recipient_name}" site টা একদম মুছে যাবে — নিশ্চিত?`)) return;
    startTransition(() => adminDeleteSite(site.id));
  }

  return (
    <div className="space-y-8">
      <section className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <p className="font-medium text-stone-800">Status</p>
          <p className="text-sm text-stone-500">{published ? "সবার জন্য visible" : "Draft — কেউ দেখতে পারবে না"}</p>
        </div>
        <button
          disabled={pending}
          onClick={handleTogglePublish}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            published ? "border-2 border-stone-200 text-stone-500 hover:bg-stone-50" : "btn-primary"
          }`}
        >
          {published ? "Unpublish" : "Publish"}
        </button>
      </section>

      <form action={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl text-fuchsia-700">Contact information</h2>

        <Field label="Recipient name">
          <input name="recipient_name" defaultValue={site.recipient_name} className="input" />
        </Field>
        <Field label="Facebook link">
          <input name="facebook_url" defaultValue={site.facebook_url ?? ""} className="input" placeholder="https://facebook.com/..." />
        </Field>
        <Field label="Instagram link">
          <input name="instagram_url" defaultValue={site.instagram_url ?? ""} className="input" placeholder="https://instagram.com/..." />
        </Field>
        <Field label="Contact email">
          <input type="email" name="contact_email" defaultValue={site.contact_email ?? ""} className="input" />
        </Field>
        <Field label="WhatsApp link">
          <input name="whatsapp_url" defaultValue={site.whatsapp_url ?? ""} className="input" placeholder="https://wa.me/8801XXXXXXXXX" />
        </Field>

        <div className="flex items-center gap-4">
          <button disabled={pending} type="submit" className="btn-primary">
            {pending ? "Saving..." : "Save changes"}
          </button>
          {saved && <span className="text-sm font-medium text-emerald-600">Saved ✓</span>}
        </div>
      </form>

      <section className="rounded-2xl border-2 border-red-100 bg-red-50 p-5">
        <p className="mb-2 text-sm font-semibold text-red-700">Danger zone</p>
        <button disabled={pending} onClick={handleDelete} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
          Delete this site
        </button>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-stone-600">{label}</span>
      {children}
    </label>
  );
}
