import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const sites = await prisma.site.findMany({
    where: { ownerId: (session.user as any).id },
    orderBy: { createdAt: "desc" }
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <h1>Your birthday sites</h1>
        <Link href="/dashboard/new" className="btn">
          + New site
        </Link>
      </div>

      <div className="site-list">
        {sites.length === 0 && <p className="muted">You haven't created a site yet.</p>}
        {sites.map((site) => (
          <div className="site-row" key={site.id}>
            <div>
              <strong>{site.title}</strong>
              <div className="muted">/site/{site.slug}</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`${baseUrl}/site/${site.slug}`} target="_blank" className="btn secondary" rel="noreferrer">
                View
              </a>
              <Link href={`/dashboard/${site.id}/edit`} className="btn">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
