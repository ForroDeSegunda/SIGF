import { NextRequest, NextResponse } from "next/server";
import { createUser, readUserWithRole } from "./app/(authPages)/users/actions";
import { updateServerSession } from "./supabase/middleware";
import { useSupabaseServer } from "./supabase/server";

const publicPathnames = ["/login", "/password"];
const adminPathnames = ["/users", "/periods", "/cashflow"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const reqUrl = new URL(req.url);
  const origin = `${req.headers.get("x-forwarded-proto")}://${req.headers.get("host")}`;
  res.headers.set("origin", origin);

  if (publicPathnames.includes(req.nextUrl.pathname)) return res;

  const server = await useSupabaseServer();
  const authUser = await server.auth.getUser();
  const userRole = await readUserWithRole();
  const isAdmin = userRole?.userRole === "admin";
  const isDirector = isAdmin || userRole?.userRole === "director";

  updateServerSession(req);

  if (authUser.error) {
    return NextResponse.redirect(`${reqUrl.origin}/login`);
  } else if (adminPathnames.includes(req.nextUrl.pathname) && !isDirector) {
    return NextResponse.redirect(`${reqUrl.origin}`);
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
    "/((?!_next/static|_next/image|favicon.ico|login|icon.png|api/auth/sign-in-google|api/auth|$).*)",
  ],
};
