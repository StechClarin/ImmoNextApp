import { NextRequest, NextResponse } from "next/server";
import {
  DuplicateReferenceError,
  deleteProperty,
  getNextPropertyReference,
  getProperties,
  saveProperty,
} from "@/lib/db";
import { slugify } from "@/lib/format";
import { requireAdminAuth } from "@/lib/auth";
import { Property } from "@/types/immo";

export const dynamic = "force-dynamic";

export async function GET() {
  const properties = await getProperties();
  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("properties:write");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const id = body.id || `prop-${Date.now()}`;
    const title = body.title || "Nouveau bien immobilier";
    const slug = body.slug || `${slugify(title)}-${id.slice(-4)}`;
    const city = String(body.city || "Brazzaville").trim() || "Brazzaville";
    const rawRef = typeof body.reference === "string" ? body.reference.trim() : "";
    const reference = rawRef || (await getNextPropertyReference(city));
    const property: Property = {
      id,
      slug,
      reference,
      title,
      transactionType: body.transactionType || "VENTE",
      category: body.category || "Villa",
      status: body.status || "DISPONIBLE",
      price: Number(body.price) || 0,
      pricePeriod: body.transactionType === "LOCATION" ? body.pricePeriod || "/ mois" : undefined,
      city,
      district: body.district || "Centre-Ville",
      address: body.address || "Brazzaville, République du Congo",
      coordinates: body.coordinates || { lat: -4.2634, lng: 15.2832 },
      surface: Number(body.surface) || 120,
      landSurface: body.landSurface ? Number(body.landSurface) : undefined,
      rooms: Number(body.rooms) || 4,
      bedrooms: Number(body.bedrooms) || 3,
      bathrooms: Number(body.bathrooms) || 2,
      description: body.description || "",
      features: Array.isArray(body.features) ? body.features : [],
      images:
        Array.isArray(body.images) && body.images.length > 0
          ? body.images
          : [
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
            ],
      featured: Boolean(body.featured),
      agentId: body.agentId || "team-1",
      createdAt: body.createdAt || new Date().toISOString(),
    };
    const saved = await saveProperty(property);
    return NextResponse.json(saved);
  } catch (e) {
    if (e instanceof DuplicateReferenceError) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du bien", details: String(e) },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("properties:delete");
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }
  const ok = await deleteProperty(id);
  return NextResponse.json({ deleted: ok });
}

