import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Query messages related to user
    const dbMessages = await sql(
      `SELECT * FROM messages
       WHERE sender = $1 OR receiver = $1
       ORDER BY created_at ASC`,
      [emailNormalized]
    );

    // Group messages by chat_id
    const chats: { [chatId: string]: any[] } = {};
    dbMessages.forEach((msg: any) => {
      const chatId = msg.chat_id;
      if (!chats[chatId]) {
        chats[chatId] = [];
      }
      chats[chatId].push({
        id: msg.id,
        sender: msg.sender,
        receiver: msg.receiver,
        text: msg.text,
        timestamp: msg.timestamp
      });
    });

    return NextResponse.json({ chats });
  } catch (error: any) {
    console.error("Chats GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { sender, receiver, text } = await req.json();

    if (!sender || !receiver || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const senderNorm = sender.toLowerCase().trim();
    const receiverNorm = receiver.toLowerCase().trim();

    const chatId = [senderNorm, receiverNorm].sort().join("_");
    const msgId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Insert message into table
    await sql(
      `INSERT INTO messages (id, chat_id, sender, receiver, text, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        msgId,
        chatId,
        senderNorm,
        receiverNorm,
        text,
        timestamp
      ]
    );

    return NextResponse.json({ success: true, messageId: msgId, timestamp });
  } catch (error: any) {
    console.error("Chats POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
