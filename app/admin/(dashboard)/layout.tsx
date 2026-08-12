import Link from "next/link";
import { logout } from "@/lib/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Countdown & Greeting" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/reasons", label: "Reasons" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/letter", label: "Letter" },
  { href: "/admin/secret", label: "Secret Photo" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-stone-200 bg-white p-4 md:w-64 md:border-b-0 md:border-r">
          <h2 className="mb-6 px-2 font-display text-2xl text-fuchsia-700">Admin</h2>
          <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-fuchsia-50 hover:text-fuchsia-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="mt-6 px-2">
            <button className="text-sm font-medium text-stone-400 hover:text-red-500">
              Log out
            </button>
          </form>
        </aside>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
