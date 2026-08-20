"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from "next-auth/react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  provider?: AuthProviderName;
};

export type AuthProviderName =
  | "google"
  | "instagram"
  | "linkedin"
  | "slack"
  | "whatsapp";

type AuthCtx = {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInWithProvider: (
    provider: AuthProviderName,
    redirectTo?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  providerConfig: Record<string, boolean>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [providerConfig, setProviderConfig] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((data) => setProviderConfig(data))
      .catch(() => {});
  }, []);

  const user: AuthUser | null =
    status === "authenticated" && session?.user
      ? {
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image,
          provider: session.user.provider as AuthProviderName | undefined,
        }
      : null;

  const signIn = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      try {
        const result = await nextAuthSignIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          return { ok: false, error: "Invalid email or password." };
        }

        return { ok: true };
      } catch {
        return { ok: false, error: "Unable to connect. Please try again." };
      }
    },
    [],
  );

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { ok: false, error: data.error || "Signup failed." };
        }

        const result = await nextAuthSignIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          return {
            ok: false,
            error: "Account created but sign-in failed. Please sign in manually.",
          };
        }

        return { ok: true };
      } catch {
        return { ok: false, error: "Unable to connect. Please try again." };
      }
    },
    [],
  );

  const signInWithProvider = useCallback(
    async (provider: AuthProviderName, redirectTo?: string): Promise<void> => {
      if (provider === "instagram") {
        throw new Error(
          "Instagram sign-in is currently unavailable. Please use Google, LinkedIn, Slack, or email.",
        );
      }

      if (provider === "whatsapp") {
        throw new Error(
          "WhatsApp sign-in is not currently available.",
        );
      }

      const configured = providerConfig[provider];
      if (configured === false) {
        throw new Error(
          `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication is not configured.`,
        );
      }

      const callbackUrl = redirectTo || "/";

      await nextAuthSignIn(provider, {
        callbackUrl,
        redirect: true,
      });
    },
    [providerConfig],
  );

  const signOut = useCallback(async () => {
    await nextAuthSignOut({ callbackUrl: "/auth" });
  }, []);

  const value: AuthCtx = {
    user,
    status,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    providerConfig,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);

  if (!c) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return c;
}
