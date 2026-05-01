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
 * Client-side logout function
 */
export function clientLogout(): void {
  // Clear localStorage session
  clearUserSession();

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
