"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type AuthUser = { id: string; name: string; email: string };
export type AuthProviderName = "google" | "instagram" | "linkedin" | "slack" | "whatsapp";
type StoredUser = AuthUser & { password?: string; provider?: AuthProviderName };

type AuthCtx = {
  user: AuthUser | null;
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: "invalid" };
  signUp: (name: string, email: string, password: string) => { ok: true } | { ok: false; error: "exists" };
  signInWithProvider: (provider: AuthProviderName) => { ok: true } | { ok: false; error: "invalid" };
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

const USERS_KEY = "inzira.users";
const CURRENT_KEY = "inzira.currentUser";
const AUTH_EVENT = "inzira-auth";

const providerLabels: Record<AuthProviderName, string> = {
  google: "Google",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  slack: "Slack",
  whatsapp: "WhatsApp",
};

function buildProviderUser(provider: AuthProviderName): StoredUser {
  const label = providerLabels[provider];
  const suffix = `${label.toLowerCase().replace(/\s+/g, "")}.local`;
  return {
    id: crypto.randomUUID(),
    name: `${label} user`,
    email: `${provider}@${suffix}`,
    provider,
    password: "social-auth",
  };
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

let cachedUser: AuthUser | null = null;
function readCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    if (!raw) {
      cachedUser = null;
      return null;
    }
    const next = JSON.parse(raw) as AuthUser;
    if (
      !cachedUser ||
      cachedUser.id !== next.id ||
      cachedUser.email !== next.email ||
      cachedUser.name !== next.name
    ) {
      cachedUser = next;
    }
    return cachedUser;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

function getSnapshot(): AuthUser | null {
  return readCurrentUser();
}

function getServerSnapshot(): AuthUser | null {
  return null;
}

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const persist = useCallback((u: AuthUser | null) => {
    if (u) localStorage.setItem(CURRENT_KEY, JSON.stringify(u));
    else localStorage.removeItem(CURRENT_KEY);
    cachedUser = u;
    notify();
  }, []);

  const signIn = useCallback(
    (email: string, password: string) => {
      const users = readUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!found) return { ok: false as const, error: "invalid" as const };
      persist({ id: found.id, name: found.name, email: found.email });
      return { ok: true as const };
    },
    [persist],
  );

  const signUp = useCallback(
    (name: string, email: string, password: string) => {
      const users = readUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false as const, error: "exists" as const };
      }
      const nu: StoredUser = { id: crypto.randomUUID(), name, email, password };
      users.push(nu);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      persist({ id: nu.id, name: nu.name, email: nu.email });
      return { ok: true as const };
    },
    [persist],
  );

  const signInWithProvider = useCallback(
    (provider: AuthProviderName) => {
      const users = readUsers();
      const socialUser = buildProviderUser(provider);
      const existing = users.find((u) => u.email.toLowerCase() === socialUser.email.toLowerCase());

      if (existing) {
        persist({ id: existing.id, name: existing.name, email: existing.email });
        return { ok: true as const };
      }

      const nextUser: StoredUser = {
        ...socialUser,
        id: crypto.randomUUID(),
      };

      users.push(nextUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      persist({ id: nextUser.id, name: nextUser.name, email: nextUser.email });
      return { ok: true as const };
    },
    [persist],
  );

  const signOut = useCallback(() => persist(null), [persist]);

  const value: AuthCtx = { user, signIn, signUp, signInWithProvider, signOut };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
