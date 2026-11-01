import { NextResponse } from "next/server";
import { identityFromToken, permissionsFromToken } from "@/lib/token-permissions";
import { SessionUnavailableError } from "@/lib/bff-proxy";
import { currentAccessToken } from "@/lib/session-server";

export const dynamic = "force-dynamic";

/**
 * Who is signed in, for the pages to show: name, email and the permissions the token carries. The token itself is not
 * returned. What a person may do is still decided by the backend on every call; this only shapes the screens.
 */
export async function GET() {
	const headers = { "cache-control": "no-store" };
	let token: string | undefined;
	try {
		token = await currentAccessToken();
	} catch (error) {
		if (error instanceof SessionUnavailableError) return NextResponse.json({ signedIn: false, unavailable: true }, { status: 503, headers });
		throw error;
	}
	if (!token) return NextResponse.json({ signedIn: false }, { headers });
	return NextResponse.json({ signedIn: true, ...identityFromToken(token), permissions: [...permissionsFromToken(token)] }, { headers });
}
