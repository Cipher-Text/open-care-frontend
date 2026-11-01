import { logout } from "@/app/(app)/logout/actions";
import { resetSession } from "@/lib/session-client";

/**
 * Sign-in tokens live only in httpOnly cookies, set by the server. Earlier versions also kept a copy in localStorage
 * (readable by any script on the page); this removes that copy from browsers that still have it.
 */
export function purgeLegacySession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("user_session");
  } catch {
    // storage may be blocked; nothing to remove then
  }
}

/**
 * Client-side logout: calls the server action that ends the session in Keycloak, deletes the httpOnly auth cookies
 * (client code cannot) and redirects to /login.
 */
export function clientLogout(): void {
  purgeLegacySession();
  resetSession();

  if (typeof window !== "undefined") {
    logout().catch(() => {
      window.location.href = "/login";
    });
  }
}
