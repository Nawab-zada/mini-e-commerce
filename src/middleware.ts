import { NextResponse, NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/orders/:path*"],
};
