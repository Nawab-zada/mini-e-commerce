import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const jwt = require("jsonwebtoken"); // Use CommonJS require to avoid type declaration error

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
