import { getAllMembers } from "@/lib/adminData";
import MembersManager from "./MembersManager";

export default async function AdminMembersPage() {
  const members = await getAllMembers();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-display text-3xl text-fuchsia-700">Members</h1>
      <p className="mb-8 text-sm text-stone-500">
        নতুন signup approve করো, দরকার হলে suspend করো, চাইলে কাউকে admin বানাও।
      </p>
      <MembersManager members={members} />
    </div>
  );
}
