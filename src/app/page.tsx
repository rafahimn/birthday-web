import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSiteHtml } from "@/lib/templateEngine";
import { demoConfig } from "@/lib/demoConfig";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const demoHtml = generateSiteHtml(demoConfig);

  return (
    <main>
      <nav className="nav">
        <div className="brand">💫 Birthday Site Builder</div>
        <div>
          {session?.user ? (
            <Link href="/dashboard" className="btn">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn secondary" style={{ marginRight: 10 }}>
                Log in
              </Link>
              <Link href="/signup" className="btn">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        <div className="card" style={{ textAlign: "center", marginTop: 20 }}>
          <h1 style={{ fontSize: 34, marginBottom: 10 }}>Make someone's birthday unforgettable 🎂</h1>
          <p className="muted" style={{ fontSize: 16, marginBottom: 24 }}>
            This is the exact template you'll get — countdown, cake cutting, reasons, photo gallery,
            video, and a letter. Try it below, then sign up to make your own with your own photos and
            message.
          </p>
        </div>

        {/* Live embedded preview of the real template */}
        <div className="card" style={{ marginTop: 24, padding: 0, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
              borderBottom: "1px solid #f0e5f4"
            }}
          >
            <strong>Live template preview</strong>
            <a href="/demo" target="_blank" rel="noreferrer" className="btn secondary">
              Open full screen ↗
            </a>
          </div>
          <div style={{ height: 600, background: "#222" }}>
            <iframe title="Live template preview" srcDoc={demoHtml} style={{ width: "100%", height: "100%", border: "none" }} />
          </div>
        </div>

        {/* How it works */}
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 16 }}>
            <div>
              <div style={{ fontSize: 28 }}>1️⃣</div>
              <h3 style={{ margin: "8px 0" }}>Sign up</h3>
              <p className="muted">Create a free account with your email — takes less than a minute.</p>
            </div>
            <div>
              <div style={{ fontSize: 28 }}>2️⃣</div>
              <h3 style={{ margin: "8px 0" }}>Customize</h3>
              <p className="muted">
                Add the recipient's name, birthday, your own photos and videos, reasons, a letter, colors,
                and more — with a live preview as you type.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 28 }}>3️⃣</div>
              <h3 style={{ margin: "8px 0" }}>Share the link</h3>
              <p className="muted">Get a unique link for your site and send it to them, anywhere.</p>
            </div>
          </div>

          {!session?.user && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Link href="/signup" className="btn" style={{ fontSize: 16, padding: "14px 32px" }}>
                Create your free site
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
