import { cookies } from "next/headers";
import { LoginResponse } from "@/types/auth";

/**
 * Get the access token from cookies
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

/**
 * Get the refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
}

/**
 * Get the token type from cookies
 */
export async function getTokenType(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token_type")?.value;
}

/**
 * Get all auth tokens from cookies
 */
export async function getAuthTokens(): Promise<{
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  scope?: string;
}> {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("access_token")?.value,
    refreshToken: cookieStore.get("refresh_token")?.value,
    tokenType: cookieStore.get("token_type")?.value,
    scope: cookieStore.get("token_scope")?.value,
  };
}

/**
 * Check if user is authenticated by checking for access token
 */
export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await getAccessToken();
  return !!accessToken;
}

/**
 * Clear all auth tokens from cookies (logout)
 */
export async function clearAuthTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("token_type");
  cookieStore.delete("token_scope");
  cookieStore.delete("remember_me");
}

const SESSION_DAYS = 7;
const REMEMBERED_DAYS = 30;

/**
 * Save auth tokens to cookies. The sign-in is kept for 7 days, or 30 when the person ticked "Remember me": that choice is made
 * at sign-in (`remember`) and kept in a cookie, so a later token refresh (which passes nothing) keeps the same length.
 */
export async function saveAuthTokens(response: LoginResponse, options: { remember?: boolean } = {}): Promise<void> {
  const cookieStore = await cookies();
  const remember = options.remember ?? cookieStore.get("remember_me")?.value === "1";
  const refreshSeconds = 60 * 60 * 24 * (remember ? REMEMBERED_DAYS : SESSION_DAYS);
  if (options.remember !== undefined) {
    if (remember) {
      cookieStore.set("remember_me", "1", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: refreshSeconds });
    } else {
      cookieStore.delete("remember_me");
    }
  }

  // Set access token
  cookieStore.set("access_token", response.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: response.expires_in || 3600,
  });

  // Set refresh token
  cookieStore.set("refresh_token", response.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshSeconds,
  });

  // Set token type
  cookieStore.set("token_type", response.token_type, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: response.expires_in || 3600,
  });

  // Set scope if provided
  if (response.scope) {
    cookieStore.set("token_scope", response.scope, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: response.expires_in || 3600,
    });
  }
}

/**
 * Get authorization header for API requests
 */
export async function getAuthHeader(): Promise<{ Authorization?: string }> {
  const tokens = await getAuthTokens();
  if (tokens.accessToken && tokens.tokenType) {
    return {
      Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
    };
  }
  return {};
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const currentRefreshToken = await getRefreshToken();

    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    // Import here to avoid circular dependency
    const { refreshToken } = await import("@/api/auth");
    const response = await refreshToken(currentRefreshToken);

    // Save the new tokens
    await saveAuthTokens(response);

    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Clear invalid tokens
    await clearAuthTokens();
    return false;
  }
}

/**
 * Get authorization header for API requests with automatic token refresh
 */
export async function getAuthHeaderWithRefresh(): Promise<{
  Authorization?: string;
}> {
  const tokens = await getAuthTokens();

  if (!tokens.accessToken || !tokens.tokenType) {
    return {};
  }

  // Return current tokens (middleware will handle refresh if needed)
  return {
    Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
  };
}
