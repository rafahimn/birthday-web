"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/lib/actions";
import type { SiteSettings } from "@/lib/types";
import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [countdownAudio, setCountdownAudio] = useState(settings.countdown_audio_url ?? "");
  const [birthdayAudio, setBirthdayAudio] = useState(settings.birthday_audio_url ?? "");

  function handleSubmit(formData: FormData) {
    setSaved(false);
    formData.set("countdown_audio_url", countdownAudio);
    formData.set("birthday_audio_url", birthdayAudio);
    startTransition(async () => {
      await updateSettings(formData);
      setSaved(true);
    });
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <Field label="Recipient name">
        <input name="recipient_name" defaultValue={settings.recipient_name} required className="input" />
      </Field>

      <Field label="Age (candle সংখ্যা নির্ধারণ করবে)">
        <input name="age" type="number" min={1} max={40} defaultValue={settings.age} required className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Birthday month">
          <select name="birthday_month" defaultValue={settings.birthday_month} className="input">
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Birthday day">
          <input name="birthday_day" type="number" min={1} max={31} defaultValue={settings.birthday_day} required className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Hour (0–23)">
          <input name="birthday_hour" type="number" min={0} max={23} defaultValue={settings.birthday_hour} required className="input" />
        </Field>
        <Field label="Minute (0–59)">
          <input name="birthday_minute" type="number" min={0} max={59} defaultValue={settings.birthday_minute} required className="input" />
        </Field>
      </div>

      <Field label="Greeting text (greeting screen-এ টাইপ হবে)">
        <textarea name="greeting_text" defaultValue={settings.greeting_text} rows={3} className="input" />
      </Field>

      <Field label="Cake screen title">
        <input name="cake_title" defaultValue={settings.cake_title} className="input" />
      </Field>

      <p className="rounded-xl bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-700">
        Facebook, Instagram, email, WhatsApp আর contact form সেটিংস এখন আলাদা{" "}
        <a href="/admin/contact" className="font-semibold underline">Contact</a> পেজে সরানো হয়েছে।
      </p>

      <Field label="Countdown ending sound (optional)">
        <div className="flex items-center gap-3">
          <input value={countdownAudio} onChange={(e) => setCountdownAudio(e.target.value)} className="input" placeholder="Audio URL" />
          <CloudinaryUploadButton resourceType="video" label="Upload" onUploaded={setCountdownAudio} />
        </div>
      </Field>

      <Field label="Birthday background song (optional)">
        <div className="flex items-center gap-3">
          <input value={birthdayAudio} onChange={(e) => setBirthdayAudio(e.target.value)} className="input" placeholder="Audio URL" />
          <CloudinaryUploadButton resourceType="video" label="Upload" onUploaded={setBirthdayAudio} />
        </div>
      </Field>

      <div className="flex items-center gap-4 pt-2">
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
