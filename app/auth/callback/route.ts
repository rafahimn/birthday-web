import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Handles links Supabase emails out (password reset, email confirmation).
 *  Exchanges the one-time code in the URL for a real session, then sends
 *  the user on to whatever page requested it (?next=...). */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/forgot-password?error=${encodeURIComponent("লিংকটার মেয়াদ শেষ হয়ে গেছে, আবার চেষ্টা করো।")}`
  );
}
