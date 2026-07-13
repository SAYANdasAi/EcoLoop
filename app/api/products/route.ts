import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export async function GET() {
  try {
    const dbProducts = await sql("SELECT * FROM products ORDER BY created_at DESC");

    const parsedProducts = dbProducts.map((p: any) => {
      let specs = [];
      if (p.specs) {
        specs = typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs;
      }

      return {
        id: p.id,
        title: p.title,
        price: p.price,
        type: p.type,
        role: p.role,
        specs: specs,
        image: p.image,
        sellerEmail: p.seller_email,
        sellerName: p.seller_name,
        date: p.date
      };
    });

    return NextResponse.json({ products: parsedProducts });
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, price, type, role, specs, image, sellerEmail, sellerName } = await req.json();

    if (!title || !price || !type || !role || !sellerEmail || !sellerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const productId = `prod-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split("T")[0];

    await sql(
      `INSERT INTO products (id, title, price, type, role, specs, image, seller_email, seller_name, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        productId,
        title,
        price,
        type,
        role,
        JSON.stringify(specs || []),
        image || "",
        sellerEmail,
        sellerName,
        today
      ]
    );

    return NextResponse.json({ success: true, productId });
  } catch (error: any) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
