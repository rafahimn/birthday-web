export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import ApproveToggle from './ApproveToggle';

export default async function AdminUsers() {
  try {
    await requireAdmin();
  } catch {
    redirect('/login?error=admin_required');
  }
  const users = await db.user.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">User Management</h1>
      <p className="mt-2 text-zinc-400">Approve members before they can create a website. Toggle the approval requirement itself from Website Settings.</p>
      <div className="mt-6 overflow-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="px-4 py-3">{u.name || '—'}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  {u.role === 'admin' ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Admin</span>
                  ) : (
                    <ApproveToggle userId={u.id} initialApproved={!!u.approved} />
                  )}
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr><td className="px-4 py-6 text-zinc-500" colSpan={4}>No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
