import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { createId, nowIso } from "@/lib/id";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role: "user" | "admin";
    };
  }

  interface User {
    role: "user" | "admin";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString() ?? "";

        if (!email || !password) {
          return null;
        }

        const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = rows[0];

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email?.toLowerCase();
      if (!email) {
        return false;
      }

      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing[0]) {
        return true;
      }

      const ts = nowIso();
      await db.insert(users).values({
        id: createId(),
        email,
        name: user.name ?? profile?.name ?? email.split("@")[0] ?? "Member",
        image: user.image ?? null,
        role: "user",
        createdAt: ts,
        updatedAt: ts,
      });

      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role ?? "user";
      } else if (token.email) {
        const rows = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email.toLowerCase()))
          .limit(1);
        const dbUser = rows[0];
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      if (account?.provider === "google" && token.email && !token.id) {
        const rows = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email.toLowerCase()))
          .limit(1);
        const dbUser = rows[0];
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role as "user" | "admin") ?? "user";
      }
      return session;
    },
  },
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
