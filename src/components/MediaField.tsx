"use client";

import { useState, useRef } from "react";
import { uploadToCloudinary, CloudinaryResourceType } from "@/lib/cloudinary-client";

export default function MediaField({
  label,
  value,
  onChange,
  resourceType = "auto",
  placeholder
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  resourceType?: CloudinaryResourceType;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, resourceType);
      onChange(url);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Paste a URL, or upload →"}
          style={{ flex: 1 }}
        />
        <label
          className="btn secondary"
          style={{ whiteSpace: "nowrap", margin: 0, opacity: uploading ? 0.6 : 1, cursor: uploading ? "wait" : "pointer" }}
        >
          {uploading ? "Uploading..." : "Upload"}
          <input
            ref={inputRef}
            type="file"
            accept={resourceType === "video" ? "video/*" : resourceType === "image" ? "image/*" : "image/*,video/*,audio/*"}
            onChange={handleFile}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
