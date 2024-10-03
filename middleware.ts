import { NextRequest, NextResponse } from "next/server";
import { updateServerSession } from "./supabase/middleware";
import { useSupabaseServer } from "./supabase/server";
import { createUser } from "./app/(authPages)/users/actions";

const publicPathnames = ["/login", "/password"];

export async function middleware(req: NextRequest) {
  const server = await useSupabaseServer();
  const origin = `${req.headers.get("x-forwarded-proto")}://${req.headers.get("host")}`;
  const reqUrl = new URL(req.url);
  const res = NextResponse.next();
  res.headers.set("origin", origin);

  updateServerSession(req);

  const authUser = await server.auth.getUser();

  if (authUser.error && !publicPathnames.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(`${reqUrl.origin}`);
  }

  if (authUser.error) {
    return NextResponse.redirect(
      `${reqUrl.origin}/login?error=${authUser.error.message}`,
    );
  }

  const foundUser = await server
    .from("user")
    .select("*")
    .eq("id", authUser.data.user.id);
  if (foundUser.data!.length === 0) {
    createUser({
      id: authUser.data.user.id,
      role: "student",
    });
  }

  return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|login|api/auth/sign-in-google|api/auth|$).*)",
  ],
};
