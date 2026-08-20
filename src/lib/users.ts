import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  emailVerified?: Date | null;
  image?: string | null;
  provider?: string;
  providerAccountId?: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const USERS_FILE = join(DATA_DIR, "users.json");

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readUsers(): StoredUser[] {
  ensureDataDir();
  if (!existsSync(USERS_FILE)) return [];
  try {
    const raw = readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  ensureDataDir();
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): StoredUser | undefined {
  return readUsers().find((u) => u.id === id);
}

export function findUserByProviderAccountId(
  provider: string,
  providerAccountId: string,
): StoredUser | undefined {
  return readUsers().find(
    (u) =>
      u.provider === provider &&
      u.providerAccountId === providerAccountId,
  );
}

export function createUser(data: {
  name: string;
  email: string;
  password?: string;
  image?: string | null;
  provider?: string;
  providerAccountId?: string;
}): StoredUser {
  const users = readUsers();
  const existing = users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase(),
  );

  if (existing) {
    if (data.provider && data.providerAccountId) {
      existing.provider = data.provider;
      existing.providerAccountId = data.providerAccountId;
    }
    if (data.image) existing.image = data.image;
    if (data.name) existing.name = data.name;
    writeUsers(users);
    return existing;
  }

  const user: StoredUser = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    password: data.password,
    image: data.image ?? null,
    emailVerified: null,
    provider: data.provider,
    providerAccountId: data.providerAccountId,
  };

  users.push(user);
  writeUsers(users);
  return user;
}

export function verifyUser(
  email: string,
  password: string,
): StoredUser | null {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;
  return user;
}
