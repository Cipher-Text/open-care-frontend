/**
 * What to tell a person whose sign-in failed. The backend passes on what Keycloak said (a status and some English text that can
 * carry internal detail, such as a wrong client secret), so that text is read here and never shown. `status` is null when the
 * sign-in service could not be reached at all (no answer, a timeout).
 */
export function loginErrorMessage(status: number | null, detail?: string): string {
	const text = (detail ?? "").toLowerCase();
	if (status === null || status >= 500) return "We could not reach the sign-in service. Please try again in a moment.";
	if (status === 429 || text.includes("temporarily disabled") || text.includes("too many")) return "Too many attempts. Wait a few minutes and try again.";
	// the server's own settings are wrong: the person did nothing, so do not say the password is
	if (text.includes("unauthorized_client") || text.includes("invalid_client") || text.includes("invalid client")) {
		return "Sign-in is not available right now. Please try again later, or contact support if it keeps happening.";
	}
	if (text.includes("account disabled") || text.includes("user disabled")) return "This account is disabled. Contact support.";
	if (text.includes("not fully set up") || text.includes("required action") || text.includes("resolve_required_actions")) {
		return "Your account needs one more step before you can sign in. Contact support.";
	}
	if (status === 400 || status === 401 || status === 403 || text.includes("invalid_grant") || text.includes("invalid user credentials")) {
		return "Incorrect username or password.";
	}
	return "Sign-in did not work. Please try again.";
}
