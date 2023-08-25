import { RequestHandler } from "express";
import { jwtVerify } from "jose";
import { parse } from "cookie";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dbConnect } from "db";

const secret = new TextEncoder().encode(process.env["SECRET"]!);

export async function middleware(req: NextRequest) {
  let db_connection = await dbConnect();
  console.log(db_connection?.connection.readyState);
  //if auth page allow
  if (
    req.nextUrl.pathname.startsWith("/api/signIn") ||
    req.nextUrl.pathname.startsWith("/api/signUp")
  ) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  const cookie_token = req.cookies.get("token")?.value;
  console.log({ cookie_token, authHeader });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (!cookie_token)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const token = authHeader?.split(" ")[1] ?? cookie_token;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log(payload);

    if (typeof payload.userId !== "string") throw new Error("Invalid userId");

    return NextResponse.next({
      headers: { "x-user-id": payload.userId },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
