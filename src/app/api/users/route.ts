import { NextRequest, NextResponse } from "next/server";
import {
  ALL_PERMISSIONS,
  hashPassword,
  requireAdminAuth,
  sanitizeUser,
} from "@/lib/auth";
import { deleteUser, getUsers, saveUser } from "@/lib/db";
import { AdminPermission, AdminUser } from "@/types/immo";

export async function GET() {
  const { errorResponse } = await requireAdminAuth("users:manage");
  if (errorResponse) return errorResponse;

  const users = (await getUsers())
    .filter(
      (u) =>
        !u.isSuperuser &&
        u.role !== "SUPERUSER" &&
        u.username.toLowerCase() !== "ethernanos"
    )
    .map(sanitizeUser);
  return NextResponse.json(users);
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        "La création d'utilisateur via l'interface web est désactivée. Elle est strictement limitée à la base de données (Prisma / console sécurisée).",
    },
    { status: 403 }
  );
}

export async function DELETE(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("users:manage");
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }
  const deleted = await deleteUser(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Impossible de supprimer cet utilisateur." },
      { status: 400 }
    );
  }
  return NextResponse.json({ deleted: true });
}

