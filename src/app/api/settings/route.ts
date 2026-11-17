import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  const { user, errorResponse } = await requireAdminAuth("settings:write");
  if (errorResponse) return errorResponse;
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const isEthernanos = user.username.toLowerCase() === "ethernanos";
    if (!isEthernanos) {
      delete body.primaryColor;
      delete body.secondaryColor;
      delete body.accentColor;
      delete body.darkColor;
    }
    const updated = await updateSettings(body);
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur mise à jour paramètres", details: String(e) },
      { status: 400 }
    );
  }
}

