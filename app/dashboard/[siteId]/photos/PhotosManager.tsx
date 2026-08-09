"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { addPhoto, deletePhoto, updatePhoto } from "@/lib/actions";
import type { Photo } from "@/lib/types";
import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";

export default function PhotosManager({ siteId, photos }: { siteId: string; photos: Photo[] }) {
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="max-w-3xl space-y-6">
      <form
        action={(fd) => {
          fd.set("image_url", imageUrl);
          startTransition(async () => {
            await addPhoto(siteId, fd);
            setImageUrl("");
            (document.getElementById("photo-form") as HTMLFormElement)?.reset();
          });
        }}
        id="photo-form"
        className="space-y-3 rounded-2xl bg-white p-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input"
            placeholder="Image URL (অথবা Upload চাপুন)"
            required
          />
          <CloudinaryUploadButton onUploaded={setImageUrl} label="Upload" />
        </div>
        {imageUrl && (
          <div className="relative h-32 w-48 overflow-hidden rounded-xl border">
            <Image src={imageUrl} alt="preview" fill className="object-cover" />
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input name="title" className="input" placeholder="Title (e.g. Her Smile)" />
          <input name="caption" className="input" placeholder="Caption" />
        </div>
        <button disabled={pending} className="btn-primary">Add photo</button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {photos.map((p) => (
          <PhotoCard key={p.id} siteId={siteId} photo={p} />
        ))}
        {photos.length === 0 && <p className="text-sm text-stone-400">এখনো কোনো ছবি যোগ করা হয়নি।</p>}
      </div>
    </div>
  );
}

function PhotoCard({ siteId, photo }: { siteId: string; photo: Photo }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl">
        <Image src={photo.image_url} alt={photo.title || "photo"} fill className="object-cover" />
      </div>
      <form action={(fd) => startTransition(() => updatePhoto(siteId, photo.id, fd))} className="space-y-2">
        <input name="title" defaultValue={photo.title} className="input" placeholder="Title" />
        <input name="caption" defaultValue={photo.caption} className="input" placeholder="Caption" />
        <div className="flex gap-2">
          <button disabled={pending} className="btn-primary text-sm">Save</button>
          <button
            type="button"
            onClick={() => startTransition(() => deletePhoto(siteId, photo.id))}
            className="btn-danger"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
