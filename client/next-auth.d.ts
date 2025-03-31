import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string; // Add custom id property
      role?: string; // Add custom role property
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string; // Add custom id property
    role?: string; // Add custom role property
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add custom id property for JWT
    role?: string; // Add custom role property for JWT
  }
}
