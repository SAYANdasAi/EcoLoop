import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const { email, device } = await req.json();

    if (!email || !device) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();
    const trackingId = `EL-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split("T")[0];

    // 1. Insert device into table
    await sql(
      `INSERT INTO devices (id, user_email, name, status, grade, payout, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        trackingId,
        emailNormalized,
        device.name,
        device.status,
        device.grade,
        device.payout || 0,
        today
      ]
    );

    // 2. Fetch user profile to calculate new statistics
    const users = await sql("SELECT payouts, carbon_averted, devices_appraised_count FROM users WHERE email = $1", [emailNormalized]);
    if (users && users.length > 0) {
      const user = users[0];
      const currentPayouts = parseFloat(user.payouts) || 0;
      const currentCarbon = parseFloat(user.carbon_averted) || 0;
      const currentCount = parseInt(user.devices_appraised_count) || 0;

      const newPayouts = currentPayouts + (device.payout || 0);
      const newCarbon = currentCarbon + ((device.payout || 0) > 0 ? 140.2 : 45.6);
      const newCount = currentCount + 1;

      // Update user
      await sql(
        `UPDATE users
         SET payouts = $1, carbon_averted = $2, devices_appraised_count = $3
         WHERE email = $4`,
        [newPayouts, newCarbon, newCount, emailNormalized]
      );
    }

    return NextResponse.json({ success: true, trackingId });
  } catch (error: any) {
    console.error("Device appraisal POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
