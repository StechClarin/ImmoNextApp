import { NextRequest, NextResponse } from "next/server";
import {
  getInquiries,
  addInquiry,
  updateInquiryStatus,
  deleteInquiry,
} from "@/lib/db";
import { requireAdminAuth } from "@/lib/auth";
import { Inquiry } from "@/types/immo";

export async function GET() {
  const { errorResponse } = await requireAdminAuth("inquiries:read");
  if (errorResponse) return errorResponse;

  return NextResponse.json(await getInquiries());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      type: body.type || "CONTACT",
      propertyId: body.propertyId,
      propertyTitle: body.propertyTitle,
      propertyRef: body.propertyRef,
      fullName: body.fullName || "Client",
      phone: body.phone || "",
      email: body.email || "",
      preferredDate: body.preferredDate,
      message: body.message || "",
      status: "NOUVEAU",
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(await addInquiry(inquiry));
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur envoi demande", details: String(e) },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("inquiries:write");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const updated = await updateInquiryStatus(body.id, body.status);
    return NextResponse.json(updated || { error: "Introuvable" });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur mise à jour", details: String(e) },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { errorResponse } = await requireAdminAuth("inquiries:delete");
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }
  return NextResponse.json({ deleted: await deleteInquiry(id) });
}

