import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function GET() {
  try {
    // 1. Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'buyer',
        plan TEXT NOT NULL DEFAULT 'free',
        payouts NUMERIC DEFAULT 0,
        carbon_averted NUMERIC DEFAULT 0,
        devices_appraised_count INTEGER DEFAULT 0,
        avatar_url TEXT,
        bank_details JSONB,
        wishlist JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        price TEXT NOT NULL,
        type TEXT NOT NULL,
        role TEXT NOT NULL,
        specs JSONB DEFAULT '[]'::jsonb,
        image TEXT,
        seller_email TEXT NOT NULL,
        seller_name TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        receiver TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 4. Create devices table
    await sql`
      CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        grade TEXT NOT NULL,
        payout NUMERIC DEFAULT 0,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return NextResponse.json({ status: "success", message: "Database schema initialized successfully." });
  } catch (error: any) {
    console.error("Database initialization error:", error);
    return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
  }
}
