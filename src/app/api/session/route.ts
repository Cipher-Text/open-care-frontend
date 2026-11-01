import { NextResponse } from "next/server";
import { identityFromToken, permissionsFromToken } from "@/lib/token-permissions";
import { currentAccessToken } from "@/lib/session-server";

export const dynamic = "force-dynamic";

/**
 * Who is signed in, for the pages to show: name, email and the permissions the token carries. The token itself is not
 * returned. What a person may do is still decided by the backend on every call; this only shapes the screens.
 */
export async function GET() {
	const token = await currentAccessToken();
	const headers = { "cache-control": "no-store" };
	if (!token) return NextResponse.json({ signedIn: false }, { headers });
	return NextResponse.json({ signedIn: true, ...identityFromToken(token), permissions: [...permissionsFromToken(token)] }, { headers });
}
