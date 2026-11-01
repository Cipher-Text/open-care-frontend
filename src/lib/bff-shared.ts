/**
 * The browser never holds the sign-in tokens (they live in httpOnly cookies, out of reach of any script on the page).
 * Signed-in calls from the browser go to this same-origin path, and the server adds the token (see app/api/bff).
 */
export const BFF_PREFIX = "/api/bff";

/** A request that changes data must carry this header: a page on another site cannot add it without a CORS preflight. */
export const CLIENT_HEADER = "x-opencare-client";

export const bffUrl = (endpoint: string): string => `${BFF_PREFIX}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

export const bffHeaders = (): Record<string, string> => ({ [CLIENT_HEADER]: "1" });
