import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/config/config";
import { clientHeaderOk, downstreamHeaders, upstreamHeaders, upstreamUrl } from "@/lib/bff-proxy";
import { currentAccessToken } from "@/lib/session-server";

export const dynamic = "force-dynamic";

/**
 * Same-origin proxy for the signed-in calls the browser makes. The browser holds no token: this adds it from the httpOnly
 * cookie (renewing it when it has expired) and passes the request to the backend, which still decides every access.
 * Without a session the request goes on anonymously, so a public endpoint works the same through here.
 */
async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }): Promise<NextResponse> {
	if (!clientHeaderOk(request.method, request.headers)) {
		return NextResponse.json({ statusCode: 403, error: "Forbidden", message: "Missing client header", code: "FORBIDDEN" }, { status: 403 });
	}
	const { path } = await context.params;
	const target = upstreamUrl(baseUrl, path, request.nextUrl.search);
	if (!target) {
		return NextResponse.json({ statusCode: 400, error: "Bad Request", message: "Invalid path", code: "BAD_REQUEST" }, { status: 400 });
	}

	const hasBody = request.method !== "GET" && request.method !== "HEAD";
	// Buffered, so the request can be sent again after a token renewal
	const body = hasBody ? await request.arrayBuffer() : undefined;

	const send = (token?: string) =>
		fetch(target, { method: request.method, headers: upstreamHeaders(request.headers, token), body, cache: "no-store", redirect: "manual" });

	try {
		let token = await currentAccessToken();
		let response = await send(token);
		if (response.status === 401 && token) {
			// The backend refused a token we thought valid (revoked, or the clock differs): renew once and retry
			token = await currentAccessToken(true);
			if (token) response = await send(token);
		}
		const noBody = response.status === 204 || response.status === 304 || request.method === "HEAD";
		return new NextResponse(noBody ? null : response.body, { status: response.status, headers: downstreamHeaders(response.headers) });
	} catch {
		return NextResponse.json({ statusCode: 502, error: "Bad Gateway", message: "The service could not be reached", code: "UPSTREAM_UNAVAILABLE" }, { status: 502 });
	}
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as HEAD };
