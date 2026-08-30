import type { JwtResponse } from "@/app/types";

const STORAGE_KEY = "learn-english-auth";

export type StoredAuth = JwtResponse;

export function saveAuth(auth: JwtResponse) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function getAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function isAdmin(auth: StoredAuth | null): boolean {
  return auth?.roles?.includes("ROLE_ADMIN") ?? false;
}
