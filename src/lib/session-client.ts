"use client";

/** Who is signed in, as the server reads it from the httpOnly cookies (`/api/session`). The token is never part of it. */
export interface SessionInfo {
  signedIn: boolean;
  name?: string;
  email?: string;
  username?: string;
  permissions?: string[];
}

const SIGNED_OUT: SessionInfo = { signedIn: false };
const TTL_MS = 60_000;
let cached: { at: number; promise: Promise<SessionInfo> } | null = null;

/** One shared request a minute, so every component on a page uses the same answer. */
export function getSession(): Promise<SessionInfo> {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    const promise = fetch("/api/session", { cache: "no-store", credentials: "same-origin" })
      .then((response) => (response.ok ? (response.json() as Promise<SessionInfo>) : SIGNED_OUT))
      .catch(() => SIGNED_OUT);
    cached = { at: Date.now(), promise };
  }
  return cached.promise;
}

/** Forget the answer (after signing in or out), so the next call asks again. */
export function resetSession(): void {
  cached = null;
}
