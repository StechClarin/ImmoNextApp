import { NextRequest, NextResponse } from "next/server";
import { getTeam, saveTeamMember, deleteTeamMember } from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { TeamMember } from "@/types/immo";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getTeam());
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("team:write");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const id = body.id || `team-${Date.now()}`;
    const member: TeamMember = {
      id,
      name: body.name || "Collaborateur",
      role: body.role || "Conseiller Immobilier",
      specialty: body.specialty || "Vente & Location",
      bio: body.bio || "",
      phone: body.phone || "+242 06 000 00 00",
      whatsapp: body.whatsapp || "242060000000",
      email: body.email || "contact@immovitrine-congo.cg",
      photo:
        body.photo ||
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      experienceYears: Number(body.experienceYears) || 5,
    };
    return NextResponse.json(await saveTeamMember(member));
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur sauvegarde membre", details: String(e) },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("team:delete");
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }
  return NextResponse.json({ deleted: await deleteTeamMember(id) });
}

