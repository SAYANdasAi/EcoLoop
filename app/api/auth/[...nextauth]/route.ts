import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { sql } from "../../../../lib/db";

const providers: any[] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
      role: { label: "Role", type: "text" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      
      try {
        const users = await sql`SELECT * FROM users WHERE email = ${credentials.email.toLowerCase()}`;
        if (users && users.length > 0) {
          const user = users[0];
          if (user.password === credentials.password) {
            // Update role in DB if custom role is supplied
            if (credentials.role && (credentials.role === "buyer" || credentials.role === "seller")) {
              await sql`UPDATE users SET role = ${credentials.role} WHERE email = ${user.email}`;
            }
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`
            };
          }
        }
      } catch (error) {
        console.error("Authorize database error:", error);
      }
      return null;
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

const handler = NextAuth({
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const emailNormalized = user.email?.toLowerCase().trim();
        if (emailNormalized) {
          try {
            const existingUsers = await sql`SELECT id FROM users WHERE email = ${emailNormalized}`;
            if (!existingUsers || existingUsers.length === 0) {
              const userId = emailNormalized.replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(1000 + Math.random() * 9000);
              const avatarUrl = user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${emailNormalized}`;
              const name = user.name || "OAuth User";
              
              await sql`
                INSERT INTO users (id, name, email, password, role, plan, payouts, carbon_averted, devices_appraised_count, avatar_url, bank_details, wishlist)
                VALUES (${userId}, ${name}, ${emailNormalized}, 'oauth_provider_no_password', 'buyer', 'free', 0.00, 0.0, 0, ${avatarUrl}, NULL, ${JSON.stringify([])})
              `;
              console.log(`Auto-registered OAuth user: ${emailNormalized}`);
            }
          } catch (e) {
            console.error("Error auto-registering OAuth user:", e);
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
});

const wrappedHandler = async (req: any, res: any) => {
  console.log("=== NEXTAUTH ROUTE CALLED ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  if (req.method === "POST") {
    try {
      const clonedReq = req.clone();
      const body = await clonedReq.text();
      console.log("POST Body:", body);
    } catch (e) {
      console.log("Error reading body:", e);
    }
  }
  try {
    return await handler(req, res);
  } catch (error) {
    console.error("NextAuth error details:", error);
    throw error;
  }
};

export { wrappedHandler as GET, wrappedHandler as POST };
