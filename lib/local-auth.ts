const USERS_KEY = "tix_users";
const SESSION_KEY = "tix_current_user";
const PASSWORD_ITERATIONS = 120_000;

type HashedLocalUser = {
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
};

type LegacyLocalUser = {
  name: string;
  email: string;
  password: string;
};

type StoredLocalUser = HashedLocalUser | LegacyLocalUser;

export type LocalUserSummary = Pick<HashedLocalUser, "name" | "email">;

function isStoredUser(value: unknown): value is StoredLocalUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Record<string, unknown>;
  if (typeof user.name !== "string" || typeof user.email !== "string") return false;
  return (
    (typeof user.salt === "string" && typeof user.passwordHash === "string")
    || typeof user.password === "string"
  );
}

function readUsers(): StoredLocalUser[] {
  const stored = window.localStorage.getItem(USERS_KEY);
  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    throw new Error("Data akun lokal tidak valid. Hapus data akun demo di browser lalu coba lagi.");
  }

  if (!Array.isArray(parsed) || !parsed.every(isStoredUser)) {
    throw new Error("Format akun lokal tidak valid. Hapus data akun demo di browser lalu coba lagi.");
  }
  return parsed;
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string) {
  if (!window.crypto?.subtle) {
    throw new Error("Browser ini tidak mendukung penyimpanan kata sandi lokal yang aman.");
  }
  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(salt.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16)),
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

function notifyAuthChanged() {
  window.dispatchEvent(new Event("tix-auth-change"));
}

export async function registerLocalUser(name: string, email: string, password: string): Promise<LocalUserSummary> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();
  if (normalizedName.length < 2) throw new Error("Nama lengkap minimal 2 karakter.");
  if (password.length < 6) throw new Error("Kata sandi minimal 6 karakter.");

  const users = readUsers();
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("Email ini sudah terdaftar. Silakan login.");
  }

  const salt = toHex(window.crypto.getRandomValues(new Uint8Array(16)));
  const passwordHash = await hashPassword(password, salt);
  const user: HashedLocalUser = { name: normalizedName, email: normalizedEmail, salt, passwordHash };
  window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  window.localStorage.setItem(SESSION_KEY, normalizedEmail);
  notifyAuthChanged();
  return { name: user.name, email: user.email };
}

export async function loginLocalUser(email: string, password: string): Promise<LocalUserSummary> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user) throw new Error("Email atau kata sandi salah. Silakan daftar jika belum memiliki akun.");

  if ("password" in user) {
    if (user.password !== password) {
      throw new Error("Email atau kata sandi salah. Silakan periksa kembali.");
    }
    const salt = toHex(window.crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = await hashPassword(password, salt);
    const upgradedUser: HashedLocalUser = { name: user.name, email: user.email, salt, passwordHash };
    window.localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users.map((item) => item === user ? upgradedUser : item)),
    );
    window.localStorage.setItem(SESSION_KEY, normalizedEmail);
    notifyAuthChanged();
    return { name: upgradedUser.name, email: upgradedUser.email };
  }

  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    throw new Error("Email atau kata sandi salah. Silakan periksa kembali.");
  }

  window.localStorage.setItem(SESSION_KEY, normalizedEmail);
  notifyAuthChanged();
  return { name: user.name, email: user.email };
}

export function getLocalUser(): LocalUserSummary | null {
  const email = window.localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const user = readUsers().find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  return { name: user.name, email: user.email };
}

export function logoutLocalUser() {
  window.localStorage.removeItem(SESSION_KEY);
  notifyAuthChanged();
}
