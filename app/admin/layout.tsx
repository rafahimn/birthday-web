import Link from "next/link";
import { requireAdmin } from "@/lib/adminData";
import { adminLogout } from "@/lib/adminActions";

const NAV = [
  { href: "/admin/members", label: "Members" },
  { href: "/admin/sites", label: "Sites" },
  { href: "/admin/templates", label: "Templates" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-stone-200 bg-stone-900 p-4 md:w-64 md:border-b-0 md:border-r">
          <h2 className="mb-1 px-0 font-display text-2xl text-white">Admin Panel</h2>
          <p className="mb-6 truncate text-xs text-stone-400">{admin.email}</p>
          <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition hover:bg-fuchsia-900/40 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={adminLogout} className="mt-6 px-2">
            <button className="text-sm font-medium text-stone-400 hover:text-red-400">Log out</button>
          </form>
        </aside>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
