import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const session = await auth();
    if (!session?.user) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (session.user.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  if (pathname.startsWith("/account")) {
    const session = await auth();
    if (!session?.user) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
