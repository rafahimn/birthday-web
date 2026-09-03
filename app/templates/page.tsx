import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Page(){
  const u = await getSessionUser().catch(() => null);
  const ctaHref = u ? '/builder/new' : '/signup';
  return <main className="mx-auto max-w-5xl px-6 py-20">
    <Link href="/">← Home</Link>
    <h1 className="mt-10 text-5xl font-black">Templates</h1>
    <p className="mt-5 max-w-2xl text-zinc-400">Right now every website is built on the Master Template — the same cinematic, interactive experience you can preview in the Live Demo (countdown, cake &amp; candles, photo gallery, letter, music and more). Pick it to start building, or preview it first.</p>
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="card overflow-hidden">
        <div className="border-b border-white/10 p-4"><b>Master Template</b><p className="text-sm text-zinc-400">Countdown • Cake &amp; candles • Gallery • Letter • Music • Guestbook</p></div>
        <div className="flex gap-2 p-4">
          <Link className="btn" href={ctaHref}>Use this template</Link>
          <Link className="btn2" href="/demo">Preview</Link>
        </div>
      </div>
      <div className="card p-5 text-zinc-400">
        <b className="text-white">More templates — coming soon</b>
        <p className="mt-2 text-sm">Romantic, Cute, Luxury, Anime, Gaming, Minimal, Elegant and Festival variations are on the roadmap as separate, selectable designs.</p>
      </div>
    </div>
  </main>;
}