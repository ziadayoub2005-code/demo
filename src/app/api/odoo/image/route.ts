import { NextRequest, NextResponse } from "next/server";

const ODOO_URL = process.env.ODOO_URL || "http://localhost:8069";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const id = searchParams.get("id");
  const field = searchParams.get("field");

  if (!model || !id || !field) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    // Odoo allows accessing product images publicly if they are published, but let's just proxy it
    const odooImageUrl = `${ODOO_URL}/web/image?model=${model}&id=${id}&field=${field}`;
    const imageRes = await fetch(odooImageUrl);

    if (!imageRes.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const imageBuffer = await imageRes.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": imageRes.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
