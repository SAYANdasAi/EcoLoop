import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Let in any user as long as the password is at least 6 characters
        if (credentials.password.length >= 6) {
          return {
            id: credentials.email.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            name: credentials.email.split("@")[0].replace(/[._]/g, " "),
            email: credentials.email,
            image: `https://api.dicebear.com/7.x/bottts/svg?seed=${credentials.email}`
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
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

export { handler as GET, handler as POST };
