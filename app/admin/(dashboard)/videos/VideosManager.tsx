"use client";

import { useState, useTransition } from "react";
import { addVideo, deleteVideo, updateVideo } from "@/lib/actions";
import type { VideoItem } from "@/lib/types";
import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";

export default function VideosManager({ videos }: { videos: VideoItem[] }) {
  const [pending, startTransition] = useTransition();
  const [videoUrl, setVideoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

  return (
    <div className="max-w-2xl space-y-6">
      <form
        action={(fd) => {
          fd.set("video_url", videoUrl);
          fd.set("poster_url", posterUrl);
          startTransition(async () => {
            await addVideo(fd);
            setVideoUrl("");
            setPosterUrl("");
            (document.getElementById("video-form") as HTMLFormElement)?.reset();
          });
        }}
        id="video-form"
        className="space-y-3 rounded-2xl bg-white p-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input" placeholder="Video URL" required />
          <CloudinaryUploadButton resourceType="video" onUploaded={setVideoUrl} label="Upload video" />
        </div>
        <div className="flex items-center gap-3">
          <input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} className="input" placeholder="Thumbnail/poster URL (optional)" />
          <CloudinaryUploadButton onUploaded={setPosterUrl} label="Upload poster" />
        </div>
        <input name="title" className="input" placeholder="Title (e.g. Happy Birthday Message)" />
        <button disabled={pending} className="btn-primary">Add video</button>
      </form>

      <div className="space-y-4">
        {videos.map((v) => (
          <VideoRow key={v.id} video={v} />
        ))}
        {videos.length === 0 && <p className="text-sm text-stone-400">এখনো কোনো ভিডিও যোগ করা হয়নি।</p>}
      </div>
    </div>
  );
}

function VideoRow({ video }: { video: VideoItem }) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(video.video_url);
  const [posterUrl, setPosterUrl] = useState(video.poster_url ?? "");
  const [saved, setSaved] = useState(false);

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="min-w-0">
          <p className="truncate font-semibold text-stone-700">{video.title || "Untitled"}</p>
          <p className="truncate text-xs text-stone-400">{video.video_url}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border-2 border-fuchsia-300 px-4 py-1.5 text-sm font-semibold text-fuchsia-600 transition hover:bg-fuchsia-50"
          >
            Edit
          </button>
          <button
            onClick={() => startTransition(() => deleteVideo(video.id))}
            className="btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={(fd) => {
        fd.set("video_url", videoUrl);
        fd.set("poster_url", posterUrl);
        setSaved(false);
        startTransition(async () => {
          await updateVideo(video.id, fd);
          setSaved(true);
          setEditing(false);
        });
      }}
      className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-2 ring-fuchsia-200"
    >
      <div className="flex items-center gap-3">
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input" placeholder="Video URL" required />
        <CloudinaryUploadButton resourceType="video" onUploaded={setVideoUrl} label="Upload video" />
      </div>
      <div className="flex items-center gap-3">
        <input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} className="input" placeholder="Thumbnail/poster URL (optional)" />
        <CloudinaryUploadButton onUploaded={setPosterUrl} label="Upload poster" />
      </div>
      <input name="title" defaultValue={video.title} className="input" placeholder="Title (e.g. Happy Birthday Message)" />
      <div className="flex items-center gap-2">
        <button disabled={pending} type="submit" className="btn-primary text-sm">
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setVideoUrl(video.video_url);
            setPosterUrl(video.poster_url ?? "");
          }}
          className="rounded-full border-2 border-stone-200 px-4 py-1.5 text-sm font-semibold text-stone-500 transition hover:bg-stone-50"
        >
          Cancel
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved ✓</span>}
      </div>
    </form>
  );
}
