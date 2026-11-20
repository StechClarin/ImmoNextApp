import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const safeName = path.basename(params.filename || "");
  if (!safeName || safeName === ".gitkeep") {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const ext = path.extname(safeName).toLowerCase();
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Type non autorisé" }, { status: 403 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", safeName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lecture fichier" },
      { status: 500 }
    );
  }
}

