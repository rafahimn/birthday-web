"use client";

import { useState, useTransition } from "react";
import { updateContactSettings } from "@/lib/actions";
import type { SiteSettings } from "@/lib/types";

export default function ContactSettingsForm({ siteId, settings }: { siteId: string; settings: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(formData: FormData) {
    setSaved(false);
    startTransition(async () => {
      await updateContactSettings(siteId, formData);
      setSaved(true);
    });
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-8">
      <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl text-fuchsia-700">Social &amp; direct contact</h2>

        <Field label="Facebook link">
          <input name="facebook_url" defaultValue={settings.facebook_url ?? ""} className="input" placeholder="https://facebook.com/..." />
        </Field>
        <Field label="Instagram link">
          <input name="instagram_url" defaultValue={settings.instagram_url ?? ""} className="input" placeholder="https://instagram.com/..." />
        </Field>
        <Field label="Contact email (mailto বাটন দেখাবে)">
          <input type="email" name="contact_email" defaultValue={settings.contact_email ?? ""} className="input" placeholder="you@example.com" />
        </Field>
        <Field label="WhatsApp link (wa.me/8801xxxxxxxxx ফরম্যাটে)">
          <input name="whatsapp_url" defaultValue={settings.whatsapp_url ?? ""} className="input" placeholder="https://wa.me/8801XXXXXXXXX" />
        </Field>
      </section>

      <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl text-fuchsia-700">Contact form (EmailJS)</h2>
        <p className="text-sm text-stone-500">
          &ldquo;Say Hi&rdquo; ফর্মে কেউ মেসেজ পাঠালে সেটা আপনার ইমেইলে পৌঁছাতে{" "}
          <a href="https://www.emailjs.com/" target="_blank" rel="noreferrer" className="font-semibold text-fuchsia-600 underline">
            emailjs.com
          </a>{" "}
          এ ফ্রি অ্যাকাউন্ট বানিয়ে Service, Template বানান — সেখান থেকে এই তিনটা key কপি করে বসান।
        </p>

        <Field label="Public key">
          <input name="emailjs_public_key" defaultValue={settings.emailjs_public_key ?? ""} className="input" />
        </Field>
        <Field label="Service ID">
          <input name="emailjs_service_id" defaultValue={settings.emailjs_service_id ?? ""} className="input" />
        </Field>
        <Field label="Template ID">
          <input name="emailjs_template_id" defaultValue={settings.emailjs_template_id ?? ""} className="input" />
        </Field>
      </section>

      <div className="flex items-center gap-4">
        <button disabled={pending} type="submit" className="btn-primary">
          {pending ? "Saving..." : "Save changes"}
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved ✓</span>}
      </div>
    </form>
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
