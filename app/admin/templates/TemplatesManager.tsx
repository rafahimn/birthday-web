"use client";

import { useState, useTransition } from "react";
import {
  createTemplate,
  updateTemplate,
  toggleTemplateActive,
  deleteTemplate,
} from "@/lib/adminActions";
import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";
import type { Template } from "@/lib/types";

export default function TemplatesManager({ templates }: { templates: Template[] }) {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-6">
      {templates.map((t) => (
        <TemplateCard key={t.id} template={t} />
      ))}

      {showNew ? (
        <TemplateForm
          onDone={() => setShowNew(false)}
          submitLabel="Create template"
          onSubmit={async (fd) => {
            await createTemplate(fd);
          }}
        />
      ) : (
        <button onClick={() => setShowNew(true)} className="btn-primary">
          + নতুন Template
        </button>
      )}
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <TemplateForm
        template={template}
        submitLabel="Save changes"
        onDone={() => setEditing(false)}
        onSubmit={async (fd) => {
          await updateTemplate(template.id, fd);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        {template.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={template.thumbnail_url} alt={template.name} className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-fuchsia-50" />
        )}
        <div>
          <p className="font-medium text-stone-800">{template.name}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              template.is_active ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
            }`}
          >
            {template.is_active ? "Active" : "Hidden"}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setEditing(true)} className="rounded-full border-2 border-stone-200 px-4 py-1.5 text-sm font-semibold text-stone-500 hover:bg-stone-50">
          Edit
        </button>
        <button
          disabled={pending}
          onClick={() => startTransition(() => toggleTemplateActive(template.id, !template.is_active))}
          className="rounded-full border-2 border-fuchsia-200 px-4 py-1.5 text-sm font-semibold text-fuchsia-600 hover:bg-fuchsia-50"
        >
          {template.is_active ? "Hide" : "Show"}
        </button>
        <button
          disabled={pending}
          onClick={() => {
            if (confirm(`"${template.name}" template মুছে ফেলবো?`)) startTransition(() => deleteTemplate(template.id));
          }}
          className="rounded-full border-2 border-red-200 px-4 py-1.5 text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function TemplateForm({
  template,
  submitLabel,
  onSubmit,
  onDone,
}: {
  template?: Template;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [thumbnail, setThumbnail] = useState(template?.thumbnail_url ?? "");

  function handleSubmit(formData: FormData) {
    formData.set("thumbnail_url", thumbnail);
    startTransition(() => onSubmit(formData));
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-2xl border-2 border-fuchsia-100 bg-white p-5 shadow-sm">
      <Field label="Template নাম">
        <input name="name" defaultValue={template?.name ?? ""} required className="input" placeholder="যেমন: Classic Pink" />
      </Field>

      <Field label="Thumbnail">
        <div className="flex items-center gap-3">
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="" className="h-12 w-12 rounded-lg object-cover" />
          )}
          <CloudinaryUploadButton onUploaded={setThumbnail} label="Upload thumbnail" />
        </div>
      </Field>

      <Field label="Greeting text">
        <input name="greeting_text" defaultValue={template?.greeting_text ?? ""} className="input" />
      </Field>
      <Field label="Cake title">
        <input name="cake_title" defaultValue={template?.cake_title ?? ""} className="input" />
      </Field>
      <Field label="Letter title">
        <input name="letter_title" defaultValue={template?.letter_title ?? ""} className="input" />
      </Field>
      <Field label="Letter content">
        <textarea name="letter_content" defaultValue={template?.letter_content ?? ""} rows={3} className="input" />
      </Field>
      <Field label="Secret button label">
        <input name="secret_button_label" defaultValue={template?.secret_button_label ?? ""} className="input" />
      </Field>

      <div className="flex gap-2">
        <button disabled={pending} type="submit" className="btn-primary">
          {pending ? "Saving..." : submitLabel}
        </button>
        <button type="button" onClick={onDone} className="rounded-full border-2 border-stone-200 px-4 py-1.5 text-sm font-semibold text-stone-500 hover:bg-stone-50">
          Cancel
        </button>
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
