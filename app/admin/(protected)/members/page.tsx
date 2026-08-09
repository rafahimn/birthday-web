import { headers } from "next/headers";
import { getAllMembers, getInviteToken } from "@/lib/adminData";
import MembersManager from "./MembersManager";
import InviteLinkCard from "./InviteLinkCard";

export default async function AdminMembersPage() {
  const [members, token] = await Promise.all([getAllMembers(), getInviteToken()]);
  const baseUrl = (await headers()).get("origin") ?? "";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-display text-3xl text-fuchsia-700">Members</h1>
      <p className="mb-8 text-sm text-stone-500">
        নতুন signup approve করো, দরকার হলে suspend করো, চাইলে কাউকে admin বানাও।
      </p>
      <InviteLinkCard baseUrl={baseUrl} token={token} />
      <MembersManager members={members} />
    </div>
  );
}
