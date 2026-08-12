"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SiteConfig, defaultSiteConfig, Reason, Photo, VideoCard } from "@/types/site-config";
import { generateSiteHtml } from "@/lib/templateEngine";
import MediaField from "@/components/MediaField";

export default function EditSitePage() {
  const { siteId } = useParams<{ siteId: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(true);
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch(`/api/sites/${siteId}`)
      .then((r) => r.json())
      .then((site) => {
        setTitle(site.title);
        setSlug(site.slug);
        setPublished(site.published);
        setConfig({ ...defaultSiteConfig, ...JSON.parse(site.config) });
        setLoading(false);
      });
  }, [siteId]);

  function update<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSavedMsg("");
    await fetch(`/api/sites/${siteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, published, config })
    });
    setSaving(false);
    setSavedMsg("Saved ✔");
    setTimeout(() => setSavedMsg(""), 2000);
  }

  async function handleDelete() {
    if (!confirm("Delete this site permanently?")) return;
    await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  if (loading) return <main className="container">Loading...</main>;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/site/${slug}`;
  const previewHtml = generateSiteHtml(config);

  // --- array field helpers ---
  const addReason = () => update("reasons", [...config.reasons, { text: "", emoji: "💗" } as Reason]);
  const updateReason = (i: number, patch: Partial<Reason>) =>
    update("reasons", config.reasons.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const removeReason = (i: number) => update("reasons", config.reasons.filter((_, idx) => idx !== i));

  const addPhoto = () => update("photos", [...config.photos, { url: "", title: "", caption: "" } as Photo]);
  const updatePhoto = (i: number, patch: Partial<Photo>) =>
    update("photos", config.photos.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const removePhoto = (i: number) => update("photos", config.photos.filter((_, idx) => idx !== i));

  const addVideo = () => update("videos", [...config.videos, { title: "", url: "" } as VideoCard]);
  const updateVideo = (i: number, patch: Partial<VideoCard>) =>
    update("videos", config.videos.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const removeVideo = (i: number) => update("videos", config.videos.filter((_, idx) => idx !== i));

  const addParagraph = () => update("letterParagraphs", [...config.letterParagraphs, ""]);
  const updateParagraph = (i: number, val: string) =>
    update("letterParagraphs", config.letterParagraphs.map((p, idx) => (idx === i ? val : p)));
  const removeParagraph = (i: number) => update("letterParagraphs", config.letterParagraphs.filter((_, idx) => idx !== i));

  return (
    <main style={{ display: "grid", gridTemplateColumns: "480px 1fr", height: "100vh" }}>
      <div style={{ overflowY: "auto", padding: 24, background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Editor</h2>
          <button className="btn secondary" onClick={() => router.push("/dashboard")}>
            ← Dashboard
          </button>
        </div>

        <div className="field" style={{ marginTop: 20 }}>
          <label>Dashboard title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="field">
          <label>Share link</label>
          <input value={shareUrl} readOnly onClick={(e) => (e.target as HTMLInputElement).select()} />
        </div>

        <div className="field">
          <label>
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published (visible via
            share link)
          </label>
        </div>

        <h3>Recipient & timing</h3>
        <div className="field">
          <label>Recipient name</label>
          <input value={config.recipientName} onChange={(e) => update("recipientName", e.target.value)} />
        </div>
        <div className="field">
          <label>Browser tab title</label>
          <input value={config.pageTitle} onChange={(e) => update("pageTitle", e.target.value)} />
        </div>
        <div className="field">
          <label>Age (number of candles)</label>
          <input type="number" value={config.age} onChange={(e) => update("age", Number(e.target.value))} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          <div className="field">
            <label>Month (0-11)</label>
            <input type="number" min={0} max={11} value={config.month} onChange={(e) => update("month", Number(e.target.value))} />
          </div>
          <div className="field">
            <label>Day</label>
            <input type="number" min={1} max={31} value={config.day} onChange={(e) => update("day", Number(e.target.value))} />
          </div>
          <div className="field">
            <label>Hour (0-23)</label>
            <input type="number" min={0} max={23} value={config.hour} onChange={(e) => update("hour", Number(e.target.value))} />
          </div>
          <div className="field">
            <label>Minute</label>
            <input type="number" min={0} max={59} value={config.minute} onChange={(e) => update("minute", Number(e.target.value))} />
          </div>
        </div>

        <h3>Theme colors</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div className="field">
            <label>Primary</label>
            <input type="color" value={config.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} />
          </div>
          <div className="field">
            <label>Secondary</label>
            <input type="color" value={config.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)} />
          </div>
          <div className="field">
            <label>Accent</label>
            <input type="color" value={config.accentColor} onChange={(e) => update("accentColor", e.target.value)} />
          </div>
        </div>

        <h3>Greeting screen</h3>
        <div className="field">
          <label>Heading</label>
          <input value={config.greetingHeading} onChange={(e) => update("greetingHeading", e.target.value)} />
        </div>
        <div className="field">
          <label>Typed line under heading</label>
          <textarea value={config.greetingTyped} onChange={(e) => update("greetingTyped", e.target.value)} />
        </div>

        <h3>Reasons screen</h3>
        <div className="field">
          <label>Heading</label>
          <input value={config.reasonsHeading} onChange={(e) => update("reasonsHeading", e.target.value)} />
        </div>
        {config.reasons.map((r, i) => (
          <div key={i} className="field" style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
            <input placeholder="Emoji" value={r.emoji} onChange={(e) => updateReason(i, { emoji: e.target.value })} style={{ width: 60, marginBottom: 6 }} />
            <textarea placeholder="Reason text" value={r.text} onChange={(e) => updateReason(i, { text: e.target.value })} />
            <input placeholder="Optional gif URL (shown on hover)" value={r.gif || ""} onChange={(e) => updateReason(i, { gif: e.target.value })} />
            <button className="btn secondary" onClick={() => removeReason(i)} style={{ marginTop: 6 }}>
              Remove
            </button>
          </div>
        ))}
        <button className="btn secondary" onClick={addReason}>
          + Add reason
        </button>

        <h3>Photo gallery</h3>
        {config.photos.map((p, i) => (
          <div key={i} className="field" style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
            <MediaField value={p.url} onChange={(url) => updatePhoto(i, { url })} resourceType="image" placeholder="Image URL" />
            <input placeholder="Title" value={p.title} onChange={(e) => updatePhoto(i, { title: e.target.value })} />
            <textarea placeholder="Caption" value={p.caption} onChange={(e) => updatePhoto(i, { caption: e.target.value })} />
            <button className="btn secondary" onClick={() => removePhoto(i)} style={{ marginTop: 6 }}>
              Remove
            </button>
          </div>
        ))}
        <button className="btn secondary" onClick={addPhoto}>
          + Add photo
        </button>

        <h3>Videos</h3>
        {config.videos.map((v, i) => (
          <div key={i} className="field" style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
            <input placeholder="Title" value={v.title} onChange={(e) => updateVideo(i, { title: e.target.value })} />
            <MediaField value={v.url} onChange={(url) => updateVideo(i, { url })} resourceType="video" placeholder="Video (.mp4) URL" />
            <MediaField
              value={v.poster || ""}
              onChange={(url) => updateVideo(i, { poster: url })}
              resourceType="image"
              placeholder="Poster image URL (optional)"
            />
            <button className="btn secondary" onClick={() => removeVideo(i)} style={{ marginTop: 6 }}>
              Remove
            </button>
          </div>
        ))}
        <button className="btn secondary" onClick={addVideo}>
          + Add video
        </button>

        <h3>Letter</h3>
        <div className="field">
          <label>Heading</label>
          <input value={config.letterHeading} onChange={(e) => update("letterHeading", e.target.value)} />
        </div>
        {config.letterParagraphs.map((p, i) => (
          <div key={i} className="field">
            <textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} />
            <button className="btn secondary" onClick={() => removeParagraph(i)}>
              Remove
            </button>
          </div>
        ))}
        <button className="btn secondary" onClick={addParagraph}>
          + Add paragraph
        </button>

        <h3>Secret / final screen</h3>
        <MediaField
          label="Secret photo"
          value={config.secretPhotoUrl}
          onChange={(url) => update("secretPhotoUrl", url)}
          resourceType="image"
        />
        <div className="field">
          <label>Button label</label>
          <input value={config.secretButtonLabel} onChange={(e) => update("secretButtonLabel", e.target.value)} />
        </div>
        <div className="field">
          <label>Button link</label>
          <input value={config.secretButtonLink} onChange={(e) => update("secretButtonLink", e.target.value)} />
        </div>

        <h3>Audio & background video</h3>
        <MediaField
          label="Countdown sound effect (mp3)"
          value={config.countdownAudioUrl}
          onChange={(url) => update("countdownAudioUrl", url)}
          resourceType="video"
        />
        <MediaField
          label="Birthday song (mp3)"
          value={config.birthdayAudioUrl}
          onChange={(url) => update("birthdayAudioUrl", url)}
          resourceType="video"
        />
        <MediaField
          label="Background video (mp4)"
          value={config.bgVideoUrl}
          onChange={(url) => update("bgVideoUrl", url)}
          resourceType="video"
        />
        <p className="muted" style={{ marginTop: -6 }}>
          Note: Cloudinary treats audio files under its "video" resource type — that's expected above.
        </p>

        <h3>Social & contact form (optional)</h3>
        <div className="field">
          <label>Facebook URL</label>
          <input value={config.facebookUrl} onChange={(e) => update("facebookUrl", e.target.value)} />
        </div>
        <div className="field">
          <label>Instagram URL</label>
          <input value={config.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)} />
        </div>
        <div className="field">
          <label>EmailJS Service ID</label>
          <input value={config.emailjsServiceId} onChange={(e) => update("emailjsServiceId", e.target.value)} />
        </div>
        <div className="field">
          <label>EmailJS Template ID</label>
          <input value={config.emailjsTemplateId} onChange={(e) => update("emailjsTemplateId", e.target.value)} />
        </div>
        <div className="field">
          <label>EmailJS Public Key</label>
          <input value={config.emailjsPublicKey} onChange={(e) => update("emailjsPublicKey", e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, marginBottom: 60 }}>
          <button className="btn" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button className="btn secondary" onClick={handleDelete}>
            Delete site
          </button>
        </div>
        {savedMsg && <p className="muted">{savedMsg}</p>}
      </div>

      <div style={{ background: "#222" }}>
        <iframe title="preview" srcDoc={previewHtml} style={{ width: "100%", height: "100%", border: "none" }} />
      </div>
    </main>
  );
}
