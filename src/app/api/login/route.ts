import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/model/User";
import bcrypt from "bcryptjs";
// Fix: Remove jsonwebtoken import and require, handle missing type by using 'any' for jwt

let jwt: any;
try {
  jwt = require("jsonwebtoken");
} catch (err) {
  // If require fails in an edge runtime (or jsonwebtoken truly missing), set jwt to null
  jwt = null;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Create response
    const response = NextResponse.json({
      status: "success",
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
