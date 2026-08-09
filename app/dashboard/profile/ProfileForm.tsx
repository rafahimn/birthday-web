"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateOwnProfile } from "@/lib/actions";
import type { Profile } from "@/lib/types";
import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [pending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const initial = (profile.full_name || profile.email || "?").trim().charAt(0).toUpperCase();

  return (
    <form
      action={(fd) => {
        fd.set("avatar_url", avatarUrl);
        startTransition(() => updateOwnProfile(fd));
      }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 font-display text-xl text-fuchsia-700">Profile picture &amp; name</h2>

      <div className="mb-5 flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-fuchsia-100">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Profile picture" fill className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-3xl text-fuchsia-500">
              {initial}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <CloudinaryUploadButton onUploaded={setAvatarUrl} label="Upload photo" />
          {avatarUrl && (
            <button
              type="button"
              onClick={() => setAvatarUrl("")}
              className="text-xs font-medium text-stone-400 hover:text-red-500"
            >
              Remove photo
            </button>
          )}
        </div>
      </div>

      <label className="mb-4 block">
        <span className="mb-1 block text-sm font-medium text-stone-600">Name</span>
        <input name="full_name" defaultValue={profile.full_name ?? ""} placeholder="Your name" className="input" />
      </label>

      <label className="mb-5 block">
        <span className="mb-1 block text-sm font-medium text-stone-600">Bio</span>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ""}
          placeholder="A short line about yourself"
          rows={3}
          className="input resize-none"
        />
      </label>

      <button disabled={pending} className="btn-primary">
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
