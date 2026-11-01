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
const RETRY_MS = 5_000;
let cached: { at: number; promise: Promise<SessionInfo> } | null = null;
let lastKnown: SessionInfo | null = null;

/**
 * One shared request a minute, so every component on a page uses the same answer. When the server says the session
 * service is unavailable (503, a short outage while renewing), the last answer is kept and asked again in 5 seconds,
 * so an outage does not look like a sign-out.
 */
export function getSession(): Promise<SessionInfo> {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    const at = Date.now();
    const promise = fetch("/api/session", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (response.status === 503 && lastKnown) {
          if (cached && cached.at === at) cached.at = at - TTL_MS + RETRY_MS;
          return lastKnown;
        }
        const info = response.ok ? ((await response.json()) as SessionInfo) : SIGNED_OUT;
        lastKnown = info;
        return info;
      })
      .catch(() => lastKnown ?? SIGNED_OUT);
    cached = { at, promise };
  }
  return cached.promise;
}

/** Forget the answer (after signing in or out), so the next call asks again. */
export function resetSession(): void {
  cached = null;
  lastKnown = null;
}
