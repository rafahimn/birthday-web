"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSitePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title || "My Birthday Site" })
    });
    const site = await res.json();
    setLoading(false);
    router.push(`/dashboard/${site.id}/edit`);
  }

  return (
    <main className="container" style={{ maxWidth: 480, marginTop: 60 }}>
      <div className="card">
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>Name your new site</h1>
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Site title (just for your dashboard, not shown publicly)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mim's Birthday 2027" />
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Creating..." : "Create & customize"}
          </button>
        </form>
      </div>
    </main>
  );
}
