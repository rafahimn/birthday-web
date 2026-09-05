'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);
  function load() { fetch('/api/admin/users').then(r => r.ok ? r.json() : []).then(setUsers); }
  useEffect(load, []);

  async function setRole(u: any, role: string) {
    if (!confirm(`Change ${u.email}'s role to "${role}"?`)) return;
    const r = await fetch(`/api/admin/users/${u.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role }) });
    if (r.ok) setUsers(xs => xs.map(x => x.id === u.id ? { ...x, role } : x));
  }

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">Admin & Support Accounts</h1>
        <p className="mt-2 text-zinc-400">Grant or revoke admin/support access. Admins can reach every page under /admin; support can be used later for a limited permission tier.</p>
        <div className="mt-6 overflow-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{u.name || '—'}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    {u.role !== 'admin' && <button className="btn2" onClick={() => setRole(u, 'admin')}>Make admin</button>}
                    {u.role !== 'support' && <button className="btn2" onClick={() => setRole(u, 'support')}>Make support</button>}
                    {u.role !== 'user' && <button className="btn2" onClick={() => setRole(u, 'user')}>Make regular user</button>}
                  </td>
                </tr>
              ))}
              {!users.length && <tr><td className="px-4 py-6 text-zinc-500" colSpan={4}>No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
