import { NextRequest, NextResponse } from "next/server";
import { updateServerSession } from "./supabase/middleware";
import { useSupabaseServer } from "./supabase/server";
import { createUser } from "./app/(authPages)/users/actions";

const publicPathnames = ["/login", "/password"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const reqUrl = new URL(req.url);
  const origin = `${req.headers.get("x-forwarded-proto")}://${req.headers.get("host")}`;
  res.headers.set("origin", origin);

  updateServerSession(req);

  const server = await useSupabaseServer();
  const { data } = await server.auth.getSession();

  if (!data.session && !publicPathnames.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(`${reqUrl.origin}`);
  }

  const user = await server
    .from("user")
    .select("*")
    .eq("id", data.session?.user.id);
  if (user.data!.length === 0) {
    createUser({
      id: data.session?.user.id!,
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
