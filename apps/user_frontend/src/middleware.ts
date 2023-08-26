import { getIdFromToken } from "utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("middleware path log:", {
    method: req.method,
    path: req.nextUrl.pathname,
  });
  if (
    req.nextUrl.pathname.startsWith("/api/user/signIn") ||
    req.nextUrl.pathname.startsWith("/api/user/signUp")
  ) {
    return NextResponse.next();
  }

  //get token from the headers
  const authHeader = req.headers.get("authorization");
  //get token from the cookies
  const cookie_token = req.cookies.get("token")?.value;

  console.log({ cookie_token, authHeader });

  if ((!authHeader || !authHeader.startsWith("Bearer ")) && !cookie_token) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  //remove bearer from the token and use, if nor available the use cookie token
  const token = authHeader?.split(" ")[1] ?? cookie_token;

  try {
    //get user id from token
    const userId = await getIdFromToken(token);

    //add user id to the headers
    return NextResponse.next({
      headers: { "x-user-id": userId },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
