import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const { email, productId } = await req.json();

    if (!email || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Retrieve user wishlist
    const users = await sql`SELECT wishlist FROM users WHERE email = ${emailNormalized}`;
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let wishlist = [];
    const wishlistRaw = users[0].wishlist;
    if (wishlistRaw) {
      wishlist = typeof wishlistRaw === "string" ? JSON.parse(wishlistRaw) : wishlistRaw;
    }

    const index = wishlist.indexOf(productId);
    if (index > -1) {
      wishlist = wishlist.filter((id: string) => id !== productId);
    } else {
      wishlist = [...wishlist, productId];
    }

    await sql`UPDATE users SET wishlist = ${JSON.stringify(wishlist)} WHERE email = ${emailNormalized}`;

    return NextResponse.json({ success: true, wishlist });
  } catch (error: any) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
