import Link from "next/link";
import { SITE_TITLE } from "@/lib/brand";

const STEPS = [
  { title: "Sign up", desc: "একটা free account বানাও — email আর password দিয়ে, সেকেন্ডে হয়ে যায়।" },
  { title: "নিজের মতো সাজাও", desc: "নাম, birthday date, greeting, reasons, photos, videos, letter, secret photo — সব admin panel থেকে edit করো।" },
  { title: "লিংক শেয়ার করো", desc: "নিজের একটা unique link পাবে (yoursite.com/s/tomar-link) — যে কাউকে পাঠাও, countdown থেকে শুরু হবে।" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-fuchsia-50 to-amber-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl text-fuchsia-700">{SITE_TITLE}</span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-fuchsia-700 hover:bg-white/60">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary text-sm">Sign up</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-10 pt-6 text-center">
        <h1 className="mb-4 font-display text-4xl text-fuchsia-700 sm:text-5xl">
          একটা birthday surprise site, নিজের হাতে বানাও
        </h1>
        <p className="mx-auto max-w-xl text-lg text-stone-600">
          Countdown → greeting → cake cutting → reasons → photo gallery → videos → letter → secret
          screen — সবকিছু, তোমার প্রিয় মানুষের জন্য কাস্টমাইজ করা, একটা লিংকে।
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-fuchsia-500">
          লাইভ ডেমো — নিচে ক্লিক করে দেখো
        </p>
        <div className="overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
          <iframe src="/demo" title="Live demo" className="h-[600px] w-full" />
        </div>
        <p className="mt-3 text-center">
          <Link href="/demo" target="_blank" className="text-sm font-semibold text-fuchsia-600 underline">
            Open full screen ↗
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="mb-8 text-center font-display text-3xl text-fuchsia-700">কীভাবে কাজ করে</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-white/70 p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-500 font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mb-2 font-semibold text-fuchsia-700">{s.title}</h3>
              <p className="text-sm text-stone-600">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/signup" className="btn-primary">এখনই শুরু করো — Sign up</Link>
        </div>
      </section>
    </main>
  );
}
