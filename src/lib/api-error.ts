/** One refused field of a request, as the backend lists it for a validation failure. */
export interface ApiFieldError {
	field: string;
	/** The constraint that failed, for example NotBlank or Size. */
	code: string;
	message: string;
}

/**
 * An error answered by the backend. `code` is its stable machine-readable name (for example FILE_TOO_LARGE), which is
 * what the interface translates; `message` is the backend's English text and is only a fallback.
 */
export class ApiError extends Error {
	readonly status: number;
	readonly code?: string;
	readonly details?: ApiFieldError[];

	constructor(message: string, status: number, code?: string, details?: ApiFieldError[]) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

/** The part of next-intl's translator that `errorMessage` needs. */
export interface ErrorTranslator {
	(key: string): string;
	has(key: string): boolean;
}

/**
 * The text to show for a failed request, in the reader's language: the message for the error's code if the message
 * files have one, else the message of the error's HTTP status code, else the backend's own English text, else `fallback`.
 * Pass `useTranslations("errors")`.
 */
export function errorMessage(error: unknown, t: ErrorTranslator, fallback?: string): string {
	if (error instanceof ApiError) {
		if (error.code && t.has(error.code)) return t(error.code);
		if (error.message) return error.message;
	} else if (error instanceof TypeError) {
		// fetch rejects with a TypeError when the network is down
		return t.has("NETWORK") ? t("NETWORK") : fallback ?? error.message;
	} else if (error instanceof Error && error.message) {
		return error.message;
	}
	return fallback ?? (t.has("SERVER_ERROR") ? t("SERVER_ERROR") : "");
}

/** The message for one field of a validation failure, or undefined when the error does not name that field. */
export function fieldMessage(error: unknown, field: string): string | undefined {
	return error instanceof ApiError ? error.details?.find((d) => d.field === field)?.message : undefined;
}

/**
 * What to tell staff when a request failed, in English (the console is English only): the server's own message when it gave one
 * (a duplicate, a refused value, a missing permission), a plain sentence for a session that ended or a server that could not be
 * reached, and `fallback` otherwise. The public site uses `errorMessage` with its translations instead.
 */
export function problemText(error: unknown, fallback: string): string {
	if (error instanceof ApiError) {
		if (error.status === 401) return "Your session has ended. Sign in again.";
		if (error.status === 403) return "You do not have permission to do this.";
		if (error.status >= 500) return fallback;
		return error.message || fallback;
	}
	if (error instanceof TypeError) return "Could not reach the server. Check the connection and try again.";
	if (error instanceof Error && error.message) return error.message;
	return fallback;
}
