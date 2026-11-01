"use client";

import { useEffect } from "react";
import { redirectAfterLogin } from "@/app/(app)/login/redirect-actions";
import { resetSession } from "@/lib/session-client";

/** Last step of Sign in with Google: the server already set the httpOnly cookies, so only go to the right area. */
export default function GoogleSignInDonePage() {
	useEffect(() => {
		resetSession();
		void redirectAfterLogin();
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
			<p role="status" className="text-sm text-muted-foreground">
				Signing you in...
			</p>
		</div>
	);
}
