import { NextResponse, type NextRequest } from "next/server";

import { getAuthenticatedUserFromToken } from "@/lib/auth";
import { getAuthCookieName, getSafeInternalRedirectPath } from "@/lib/security";

const protectedRoutes = ["/dashboard", "/notes"];
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(getAuthCookieName())?.value;
  const authUser = await getAuthenticatedUserFromToken(token);

  if (authUser && authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!authUser) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", getSafeInternalRedirectPath(pathname, "/dashboard"));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/notes/:path*", "/login", "/signup"],
};
