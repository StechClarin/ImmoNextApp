import { NextRequest, NextResponse } from "next/server";
import { getArticles, saveArticle, deleteArticle } from "@/lib/db";
import { slugify } from "@/lib/format";
import { requireAdminAuth } from "@/lib/auth";
import { Article } from "@/types/immo";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getArticles());
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("articles:write");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const id = body.id || `art-${Date.now()}`;
    const title = body.title || "Nouvelle actualité";
    const article: Article = {
      id,
      slug: body.slug || `${slugify(title)}-${id.slice(-4)}`,
      title,
      category: body.category || "Actualité",
      excerpt: body.excerpt || "",
      content: body.content || "",
      coverImage:
        body.coverImage ||
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80",
      author: body.author || "Équipe ImmoVitrine",
      publishedAt: body.publishedAt || new Date().toISOString().slice(0, 10),
      readTime: body.readTime || "4 min",
    };
    return NextResponse.json(await saveArticle(article));
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde de l'article", details: String(e) },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("articles:delete");
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }
  return NextResponse.json({ deleted: await deleteArticle(id) });
}

