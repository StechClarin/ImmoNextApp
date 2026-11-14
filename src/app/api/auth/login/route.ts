import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  authenticateUser,
  registerActiveSession,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "");
    const password = String(body.password || "");

    const user = await authenticateUser(username, password);
    if (!user) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const isHttps =
      req.nextUrl.protocol === "https:" ||
      req.headers.get("x-forwarded-proto") === "https";

    // Enregistrement de la session unique (1 heure, un seul poste à la fois)
    const { token, maxAge } = await registerActiveSession(user);

    const res = NextResponse.json({ user });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge, // 3600s = 1 heure
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur lors de la connexion", details: String(e) },
      { status: 500 }
    );
  }
}

