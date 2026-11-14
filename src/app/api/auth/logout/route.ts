import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, revokeActiveSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const isHttps =
    req.nextUrl.protocol === "https:" ||
    req.headers.get("x-forwarded-proto") === "https";

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await revokeActiveSession(token);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: 0,
  });
  return res;
}

