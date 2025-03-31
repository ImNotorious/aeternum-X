import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider for Email/Password Authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Connect to MongoDB
          const client = await clientPromise;
          const db = client.db("aeternum");

          // Find user by email
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user) {
            return null; // User not found
          }

          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isValidPassword) {
            return null; // Invalid password
          }

          // Return user object for the session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            role: user.role || "patient",
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JSON Web Tokens for sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "patient";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
