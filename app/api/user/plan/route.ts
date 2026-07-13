import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function PUT(req: Request) {
  try {
    const { email, plan } = await req.json();

    if (!email || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    await sql`UPDATE users SET plan = ${plan} WHERE email = ${emailNormalized}`;

    return NextResponse.json({ success: true, message: `Subscription upgraded to ${plan}.` });
  } catch (error: any) {
    console.error("Plan PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
