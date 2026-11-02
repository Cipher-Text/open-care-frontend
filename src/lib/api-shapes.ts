import { z } from "zod";

/**
 * What the screens rely on from the API, checked where the answer arrives. Most answers are only displayed, and a missing
 * field there shows a blank; these two drive decisions (which menu and buttons a person gets, how many pages a list has), so
 * a wrong shape must stop with a plain error and never be taken for "no permissions" or "no results".
 */
export class UnexpectedAnswerError extends Error {
	constructor(what: string) {
		super(`The server sent an answer the app could not read (${what}). Try again in a moment.`);
		this.name = "UnexpectedAnswerError";
	}
}

const count = z.number().int().nonnegative();

/** The backend's page envelope. Every field may be missing or null (an empty page); present fields must be the right type. */
export const pageShape = z.object({
	content: z.array(z.unknown()).nullish(),
	currentPage: count.nullish(),
	totalItems: count.nullish(),
	totalPages: count.nullish(),
});

export const capabilitiesShape = z.object({
	userType: z.string().nullable(),
	permissions: z.array(z.string()),
	features: z.record(z.string(), z.boolean()),
});

export function checked<S extends z.ZodType>(schema: S, data: unknown, what: string): z.infer<S> {
	const result = schema.safeParse(data);
	if (!result.success) throw new UnexpectedAnswerError(what);
	return result.data;
}
