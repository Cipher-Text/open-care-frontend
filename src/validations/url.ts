import { z } from "zod";

/** A well-formed URL that uses http or https; javascript:, data: and the like are rejected. */
export function isHttpUrl(value: string): boolean {
	if (!z.string().url().safeParse(value).success) return false;
	try {
		const { protocol } = new URL(value);
		return protocol === "http:" || protocol === "https:";
	} catch {
		return false;
	}
}
