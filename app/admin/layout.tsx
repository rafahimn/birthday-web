import Link from 'next/link';
import { ADMIN_MODULES } from '@/lib/admin-nav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
      <aside className="hidden w-56 shrink-0 md:block">
        <Link href="/admin" className="mb-4 block font-bold">🎂 Admin</Link>
        <nav className="space-y-1 text-sm">
          {ADMIN_MODULES.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-zinc-400 hover:bg-white/5 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
