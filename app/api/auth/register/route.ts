import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Check if email already exists
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${emailNormalized}`;
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const userId = emailNormalized.replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(1000 + Math.random() * 9000);
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${emailNormalized}`;

    // Insert user into table using tagged templates
    await sql`
      INSERT INTO users (id, name, email, password, role, plan, payouts, carbon_averted, devices_appraised_count, avatar_url, bank_details, wishlist)
      VALUES (${userId}, ${name}, ${emailNormalized}, ${password}, ${role}, 'free', 0.00, 0.0, 0, ${avatarUrl}, NULL, ${JSON.stringify([])})
    `;

    return NextResponse.json({ success: true, message: "User registered successfully." });
  } catch (error: any) {
    console.error("Registration endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
