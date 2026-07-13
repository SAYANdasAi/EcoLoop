import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Query user profile using tagged template
    const users = await sql`SELECT * FROM users WHERE email = ${emailNormalized}`;
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Fetch user appraised devices using tagged template
    const devices = await sql`SELECT * FROM devices WHERE user_email = ${emailNormalized} ORDER BY created_at DESC`;

    // Parse bank details and wishlist JSON fields safely
    let bankDetails = null;
    if (user.bank_details) {
      bankDetails = typeof user.bank_details === "string" ? JSON.parse(user.bank_details) : user.bank_details;
    }

    let wishlist = [];
    if (user.wishlist) {
      wishlist = typeof user.wishlist === "string" ? JSON.parse(user.wishlist) : user.wishlist;
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      payouts: parseFloat(user.payouts) || 0,
      carbonAverted: parseFloat(user.carbon_averted) || 0,
      devicesAppraisedCount: parseInt(user.devices_appraised_count) || 0,
      avatarUrl: user.avatar_url,
      bankDetails: bankDetails,
      wishlist: wishlist,
      devicesList: devices || []
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { email, name, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    if (name && role) {
      await sql`UPDATE users SET name = ${name}, role = ${role} WHERE email = ${emailNormalized}`;
    } else if (name) {
      await sql`UPDATE users SET name = ${name} WHERE email = ${emailNormalized}`;
    } else if (role) {
      await sql`UPDATE users SET role = ${role} WHERE email = ${emailNormalized}`;
    } else {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully." });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
