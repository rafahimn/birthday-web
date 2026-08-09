"use client";

import { useTransition } from "react";
import Image from "next/image";
import { approveMember, unapproveMember, setAdminRole } from "@/lib/adminActions";
import type { Profile } from "@/lib/types";

function MemberAvatar({ member }: { member: Profile }) {
  const initial = (member.full_name || member.email || "?").trim().charAt(0).toUpperCase();
  return (
    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-fuchsia-100">
      {member.avatar_url ? (
        <Image src={member.avatar_url} alt="" fill className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-bold text-fuchsia-500">
          {initial}
        </span>
      )}
    </span>
  );
}

export default function MembersManager({ members }: { members: Profile[] }) {
  const [pending, startTransition] = useTransition();

  const pendingMembers = members.filter((m) => !m.approved);
  const approvedMembers = members.filter((m) => m.approved);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 font-display text-xl text-fuchsia-700">
          Approval-এর অপেক্ষায় ({pendingMembers.length})
        </h2>
        {pendingMembers.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-stone-500 shadow-sm">কেউ অপেক্ষায় নেই।</p>
        ) : (
          <div className="space-y-3">
            {pendingMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <MemberAvatar member={m} />
                  <div>
                    <p className="font-medium text-stone-800">{m.full_name || m.email}</p>
                    {m.full_name && <p className="text-xs text-stone-400">{m.email}</p>}
                    <p className="text-xs text-stone-400">Signed up: {new Date(m.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => approveMember(m.id))}
                  className="btn-primary"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-fuchsia-700">
          Approved Members ({approvedMembers.length})
        </h2>
        <div className="space-y-3">
          {approvedMembers.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <MemberAvatar member={m} />
                <div>
                  <p className="font-medium text-stone-800">
                    {m.full_name || m.email}{" "}
                    {m.is_admin && <span className="ml-2 rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-semibold text-fuchsia-700">Admin</span>}
                  </p>
                  {m.full_name && <p className="text-xs text-stone-400">{m.email}</p>}
                  <p className="text-xs text-stone-400">Signed up: {new Date(m.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => unapproveMember(m.id))}
                  className="rounded-full border-2 border-stone-200 px-4 py-1.5 text-sm font-semibold text-stone-500 hover:bg-stone-50"
                >
                  Suspend
                </button>
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => setAdminRole(m.id, !m.is_admin))}
                  className="rounded-full border-2 border-fuchsia-200 px-4 py-1.5 text-sm font-semibold text-fuchsia-600 hover:bg-fuchsia-50"
                >
                  {m.is_admin ? "Remove admin" : "Make admin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
