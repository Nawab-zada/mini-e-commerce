import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// @ts-expect-error: No types; ensure types if available
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // If no token, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // Allow access
  } catch {
    // Invalid token
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/orders/:path*"],
};
