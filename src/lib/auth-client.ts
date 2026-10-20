import { logout } from "@/app/logout/actions";

import { LoginResponse } from "@/types/auth";

/**
 * Client-side function to get user session from localStorage
 */
export function getUserSession(): LoginResponse | null {
  if (typeof window === "undefined") return null;

  try {
    const sessionData = localStorage.getItem("user_session");
    return sessionData ? JSON.parse(sessionData) : null;
  } catch {
    return null;
  }
}

/**
 * Client-side function to save user session to localStorage
 */
export function saveUserSession(response: LoginResponse): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("user_session", JSON.stringify(response));
}

/**
 * Client-side function to clear user session from localStorage
 */
export function clearUserSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user_session");
}

/**
 * Client-side function to get authorization header
 */
export function getAuthHeader(): { Authorization?: string } {
  const session = getUserSession();

  if (session?.access_token && session?.token_type) {
    return {
      Authorization: `${session.token_type} ${session.access_token}`,
    };
  }

  return {};
}

/**
 * Client-side logout. Clears the localStorage session, then calls the server action that
 * deletes the httpOnly auth cookies (client code cannot) and redirects to /login. Clearing
 * only localStorage left the cookie behind, and the middleware sent /login straight back
 * to /admin.
 */
export function clientLogout(): void {
  clearUserSession();

  if (typeof window !== "undefined") {
    logout().catch(() => {
      window.location.href = "/login";
    });
  }
}
