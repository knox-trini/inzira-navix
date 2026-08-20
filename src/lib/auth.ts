import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import Slack from "next-auth/providers/slack";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      provider?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    provider?: string;
  }
}

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  );
}

if (process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET) {
  providers.push(
    Slack({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
    }),
  );
}

providers.push(
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const { verifyUser } = await import("@/lib/users");
      const user = verifyUser(
        credentials.email as string,
        credentials.password as string,
      );

      if (!user) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  }),
);

const nextAuth = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id =
          (profile as Record<string, unknown>).sub as string ||
          token.sub ||
          "";
        token.provider = account.provider;

        const { createUser, findUserByProviderAccountId } = await import(
          "@/lib/users"
        );

        let user = findUserByProviderAccountId(
          account.provider,
          account.providerAccountId,
        );

        if (!user) {
          const profileData = profile as Record<string, unknown>;
          user = createUser({
            name:
              (profileData.name as string) ||
              (profileData.given_name as string) ||
              "User",
            email: (profileData.email as string) || "",
            image: (profileData.picture as string) || null,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          });
        }

        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string) || "";
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "credentials") return true;
      if (account && profile) {
        const email = (profile as Record<string, unknown>).email as
          | string
          | undefined;
        if (!email) return false;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});

export const { handlers, auth, signIn, signOut } = nextAuth;
export const GET = handlers.GET;
export const POST = handlers.POST;

export function isProviderConfigured(provider: string): boolean {
  switch (provider) {
    case "google":
      return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    case "linkedin":
      return !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
    case "slack":
      return !!(process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET);
    case "instagram":
      return false;
    case "whatsapp":
      return false;
    default:
      return false;
  }
}
