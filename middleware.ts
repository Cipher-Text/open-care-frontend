import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	// Get the access token from cookies
	const accessToken = request.cookies.get("access_token");

	// Define protected routes
	const protectedRoutes = ["/admin"];
	const authRoutes = ["/login", "/signup"];

	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	const isAuthRoute = authRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	// If trying to access protected route without token, redirect to login
	if (isProtectedRoute && !accessToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// If already authenticated and trying to access auth routes, redirect to admin
	if (isAuthRoute && accessToken) {
		return NextResponse.redirect(new URL("/admin", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|public).*)",
	],
};
