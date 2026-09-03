import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Home(){
  const u = await getSessionUser().catch(() => null);
  return <main className="min-h-screen"><nav className="mx-auto flex max-w-6xl items-center justify-between p-6"><b className="text-xl">🎂 Birthday Builder</b><div className="flex gap-4 text-sm">
    <Link href="/demo">Live Demo</Link>
    <Link href="/templates">Templates</Link>
    <Link href="/features">Features</Link>
    <Link href="/pricing">Pricing</Link>
    {u ? <Link href="/dashboard" className="font-semibold text-pink-400">Dashboard</Link> : <Link href="/login">Login</Link>}
  </div></nav><section className="mx-auto max-w-6xl px-6 py-24 text-center"><p className="text-pink-400">CREATE • CUSTOMIZE • SHARE</p><h1 className="mt-4 text-6xl font-black">Build a birthday website<br/>they will never forget.</h1><p className="mx-auto mt-6 max-w-2xl text-zinc-400">Turn your memories, messages, photos and wishes into a cinematic interactive birthday experience.</p><div className="mt-8 flex justify-center gap-3">{u ? <Link className="btn" href="/dashboard">Go to Dashboard</Link> : <Link className="btn" href="/signup">Create Website</Link>}<Link className="btn2" href="/demo">See Live Demo</Link></div></section><section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 md:grid-cols-3">{['Interactive cake & candles','Photo, video, music & memories','Publish instantly with a shareable URL'].map(x=><div className="card p-6" key={x}><h3 className="font-bold">{x}</h3><p className="mt-2 text-sm text-zinc-400">Everything is connected to the builder and published website.</p></div>)}</section><footer className="border-t border-white/10 p-8 text-center text-sm text-zinc-500">Birthday Builder • Made for unforgettable moments</footer></main>;
}
