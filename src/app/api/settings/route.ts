import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("settings:write");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const updated = await updateSettings(body);
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur mise à jour paramètres", details: String(e) },
      { status: 400 }
    );
  }
}

