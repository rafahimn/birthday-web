"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: CloudinaryResult) => void
      ) => { open: () => void };
    };
  }
}

interface CloudinaryResult {
  event: string;
  info?: { secure_url: string };
}

interface Props {
  onUploaded: (url: string) => void;
  resourceType?: "image" | "video" | "auto";
  label?: string;
}

export default function CloudinaryUploadButton({
  onUploaded,
  resourceType = "image",
  label = "Upload",
}: Props) {
  const [ready, setReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || window.cloudinary) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
      setReady(true);
    };
    document.body.appendChild(script);
  }, []);

  function openWidget() {
    if (!window.cloudinary) return;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary env variable set করা নেই (.env.local দেখুন)।");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        resourceType,
        multiple: false,
        maxFiles: 1,
      },
      (error, result) => {
        if (error) {
          setUploading(false);
          return;
        }
        if (result.event === "success" && result.info?.secure_url) {
          onUploaded(result.info.secure_url);
        }
        if (result.event === "close") {
          setUploading(false);
        }
      }
    );
    setUploading(true);
    widget.open();
  }

  return (
    <button
      type="button"
      onClick={openWidget}
      disabled={!ready || uploading}
      className="rounded-full border-2 border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
    >
      {uploading ? "Uploading..." : label}
    </button>
  );
}
