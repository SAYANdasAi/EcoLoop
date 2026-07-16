import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// Initialize empty JSON database file if it doesn't exist
const DB_FILE = path.join(process.cwd(), "local_db.json");

function getLocalData() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      devices: [],
      messages: [],
      products: [
        {
          id: "prod-1",
          title: "iPhone 13 Pro (Refurbished)",
          price: "₹45,000",
          type: "phone",
          role: "sell",
          specs: ["128GB", "Sierra Blue", "Battery 88%"],
          image: "https://images.unsplash.com/photo-1632624000450-957236014361?q=80&w=400",
          seller_email: "system@ecoloop.in",
          seller_name: "EcoLoop Official",
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString()
        },
        {
          id: "prod-2",
          title: "MacBook Air M1 (Fair)",
          price: "₹38,000",
          type: "laptop",
          role: "sell",
          specs: ["256GB", "Space Gray", "Battery 76%"],
          image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400",
          seller_email: "system@ecoloop.in",
          seller_name: "EcoLoop Official",
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return { users: [], devices: [], messages: [], products: [] };
  }
}

function saveLocalData(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function localQuery(queryText: string, params: any[] = []): any {
  const data = getLocalData();
  const normalizedQuery = queryText.replace(/\s+/g, " ").trim();

  // 1. SELECT * FROM users (next-auth, register)
  if (normalizedQuery.match(/SELECT \* FROM users WHERE email =/i)) {
    const email = params[0] || normalizedQuery.split("=").pop()?.replace(/['"]/g, "").trim();
    if (!email) return [];
    return data.users.filter((u: any) => u.email.toLowerCase() === email.toLowerCase());
  }

  // 2. SELECT id FROM users
  if (normalizedQuery.match(/SELECT id FROM users WHERE email =/i)) {
    const email = params[0] || normalizedQuery.split("=").pop()?.replace(/['"]/g, "").trim();
    if (!email) return [];
    return data.users
      .filter((u: any) => u.email.toLowerCase() === email.toLowerCase())
      .map((u: any) => ({ id: u.id }));
  }

  // 3. SELECT wishlist FROM users
  if (normalizedQuery.match(/SELECT wishlist FROM users WHERE email =/i)) {
    const email = params[0] || normalizedQuery.split("=").pop()?.replace(/['"]/g, "").trim();
    if (!email) return [];
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    return user ? [{ wishlist: user.wishlist }] : [];
  }

  // 4. SELECT payouts, carbon_averted, devices_appraised_count FROM users
  if (normalizedQuery.match(/SELECT payouts, carbon_averted, devices_appraised_count FROM users WHERE email =/i)) {
    const email = params[0] || normalizedQuery.split("=").pop()?.replace(/['"]/g, "").trim();
    if (!email) return [];
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    return user ? [{ 
      payouts: user.payouts, 
      carbon_averted: user.carbon_averted, 
      devices_appraised_count: user.devices_appraised_count 
    }] : [];
  }

  // 5. INSERT INTO users
  if (normalizedQuery.match(/INSERT INTO users/i)) {
    let id, name, email, password, role, avatar_url, wishlistStr;
    if (params.length === 5) {
      // OAuth register insert from nextauth route
      id = params[0];
      name = params[1];
      email = params[2];
      password = 'oauth_provider_no_password';
      role = 'buyer';
      avatar_url = params[3];
      wishlistStr = params[4];
    } else {
      // Standard register insert
      id = params[0];
      name = params[1];
      email = params[2];
      password = params[3];
      role = params[4];
      avatar_url = params[5];
      wishlistStr = params[6];
    }
    
    const newUser = {
      id,
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'buyer',
      plan: 'free',
      payouts: 0.00,
      carbon_averted: 0.0,
      devices_appraised_count: 0,
      avatar_url,
      bank_details: null,
      wishlist: wishlistStr ? (typeof wishlistStr === "string" ? JSON.parse(wishlistStr) : wishlistStr) : []
    };
    data.users.push(newUser);
    saveLocalData(data);
    return [newUser];
  }

  // 6. UPDATE users SET payouts = $1, carbon_averted = $2, devices_appraised_count = $3 WHERE email = $4
  if (normalizedQuery.match(/UPDATE users SET payouts =/i)) {
    const [payouts, carbon_averted, devices_appraised_count, email] = params;
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.payouts = Number(payouts);
      user.carbon_averted = Number(carbon_averted);
      user.devices_appraised_count = Number(devices_appraised_count);
      saveLocalData(data);
    }
    return [];
  }

  // 7. UPDATE users SET name =
  if (normalizedQuery.match(/UPDATE users SET name = \$1, role = \$2/i)) {
    const [name, role, email] = params;
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.name = name;
      user.role = role;
      saveLocalData(data);
    }
    return [];
  }

  if (normalizedQuery.match(/UPDATE users SET name =/i)) {
    const [name, email] = params;
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.name = name;
      saveLocalData(data);
    }
    return [];
  }

  // 7b. UPDATE users SET role =
  if (normalizedQuery.match(/UPDATE users SET role =/i)) {
    const [role, email] = params;
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.role = role;
      saveLocalData(data);
    }
    return [];
  }

  // 8. UPDATE users SET plan =
  if (normalizedQuery.match(/UPDATE users SET plan =/i)) {
    const [plan, email] = params;
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.plan = plan;
      saveLocalData(data);
    }
    return [];
  }

  // 9. UPDATE users SET bank_details =
  if (normalizedQuery.match(/UPDATE users SET bank_details =/i)) {
    const [bankDetails, email] = params;
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.bank_details = typeof bankDetails === "string" ? JSON.parse(bankDetails) : bankDetails;
      saveLocalData(data);
    }
    return [];
  }

  // 10. UPDATE users SET wishlist =
  if (normalizedQuery.match(/UPDATE users SET wishlist =/i)) {
    const [wishlist, email] = params;
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.wishlist = typeof wishlist === "string" ? JSON.parse(wishlist) : wishlist;
      saveLocalData(data);
    }
    return [];
  }

  // 11. SELECT * FROM devices WHERE user_email =
  if (normalizedQuery.match(/SELECT \* FROM devices WHERE user_email =/i)) {
    const email = params[0] || normalizedQuery.split("=").pop()?.replace(/['"]/g, "").trim();
    if (!email) return [];
    return data.devices
      .filter((d: any) => d.user_email.toLowerCase() === email.toLowerCase())
      .sort((a: any, b: any) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime());
  }

  // 12. INSERT INTO devices
  if (normalizedQuery.match(/INSERT INTO devices/i)) {
    const [id, user_email, name, status, grade, payout, date] = params;
    const newDevice = {
      id,
      user_email: user_email.toLowerCase(),
      name,
      status,
      grade,
      payout: Number(payout) || 0,
      date,
      created_at: new Date().toISOString()
    };
    data.devices.push(newDevice);
    saveLocalData(data);
    return [newDevice];
  }

  // 13. SELECT * FROM messages WHERE sender = OR receiver =
  if (normalizedQuery.match(/SELECT \* FROM messages WHERE/i)) {
    const email = params[0];
    if (!email) return [];
    return data.messages
      .filter((m: any) => m.sender.toLowerCase() === email.toLowerCase() || m.receiver.toLowerCase() === email.toLowerCase())
      .sort((a: any, b: any) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
  }

  // 14. INSERT INTO messages
  if (normalizedQuery.match(/INSERT INTO messages/i)) {
    const [id, chat_id, sender, receiver, text, timestamp] = params;
    const newMessage = {
      id,
      chat_id,
      sender: sender.toLowerCase(),
      receiver: receiver.toLowerCase(),
      text,
      timestamp,
      created_at: new Date().toISOString()
    };
    data.messages.push(newMessage);
    saveLocalData(data);
    return [newMessage];
  }

  // 15. SELECT * FROM products
  if (normalizedQuery.match(/SELECT \* FROM products/i)) {
    return [...data.products].sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }

  // 16. INSERT INTO products
  if (normalizedQuery.match(/INSERT INTO products/i)) {
    const [id, title, price, type, role, specs, image, seller_email, seller_name, date] = params;
    const newProduct = {
      id,
      title,
      price,
      type,
      role,
      specs: typeof specs === "string" ? JSON.parse(specs) : specs,
      image,
      seller_email: seller_email.toLowerCase(),
      seller_name,
      date,
      created_at: new Date().toISOString()
    };
    data.products.push(newProduct);
    saveLocalData(data);
    return [newProduct];
  }

  // 17. Generic table/schema create
  if (normalizedQuery.match(/CREATE TABLE/i)) {
    return [];
  }

  console.warn("Unhandled local query runner:", normalizedQuery, "params:", params);
  return [];
}

export const sql: any = function (strings: any, ...values: any[]): any {
  const hasDbUrl = !!process.env.DATABASE_URL;

  if (typeof strings === "string") {
    // Called as: sql(query, params)
    const params = values[0] || [];
    if (hasDbUrl) {
      return (neon(process.env.DATABASE_URL!) as any)(strings, params);
    } else {
      return localQuery(strings, params);
    }
  }

  // Called as: sql`query with ${param}`
  let queryText = "";
  strings.forEach((string: string, i: number) => {
    queryText += string;
    if (i < values.length) {
      queryText += `$${i + 1}`;
    }
  });

  if (hasDbUrl) {
    return neon(process.env.DATABASE_URL!)(strings as any, ...values);
  } else {
    return localQuery(queryText, values);
  }
};
