"use client";

import { useEffect } from "react";
import { redirectAfterLogin } from "@/app/login/redirect-actions";
import { saveUserSession } from "@/lib/auth-client";
import { readSessionForClient } from "../actions";

/** Last step of Sign in with Google: keep the session like the password login does, then go to the right area. */
export default function GoogleSignInDonePage() {
	useEffect(() => {
		readSessionForClient().then((session) => {
			if (session) saveUserSession(session);
			return redirectAfterLogin();
		});
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
			<p role="status" className="text-sm text-muted-foreground">
				Signing you in...
			</p>
		</div>
	);
}
