import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function PUT(req: Request) {
  try {
    const { email, bankDetails } = await req.json();

    if (!email || !bankDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    await sql`UPDATE users SET bank_details = ${JSON.stringify(bankDetails)} WHERE email = ${emailNormalized}`;

    return NextResponse.json({ success: true, message: "Bank details updated in database." });
  } catch (error: any) {
    console.error("Bank PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
