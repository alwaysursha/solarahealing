import { auth } from "@/auth.edge";
import { NextResponse } from "next/server";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  if (pathname.startsWith("/account") && !session?.user) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
