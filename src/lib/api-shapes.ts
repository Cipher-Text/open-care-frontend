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
	organisations: z
		.array(z.object({ kind: z.enum(["HOSPITAL", "INSTITUTION", "SOCIAL_ORGANIZATION", "ASSOCIATION"]), organisationId: z.number(), name: z.string(), role: z.enum(["ADMIN", "USER"]), position: z.string().nullable() }).passthrough())
		.default([]),
});

/** The open times of a doctor: whether booking is open and which times can be chosen. */
export const slotListShape = z.object({
	bookable: z.boolean(),
	message: z.string().nullish(),
	slots: z.array(z.object({ date: z.string(), startTime: z.string(), endTime: z.string() }).passthrough()),
});

/** A consent request: its state decides whether the doctor may go on to write the prescription. */
export const consentRequestShape = z
	.object({ id: z.number().int(), status: z.enum(["PENDING", "APPROVED", "DENIED", "EXPIRED", "CANCELLED"]) })
	.passthrough();

export const patientLookupShape = z.object({ profileId: z.number().int().positive() }).passthrough();

export function checked<S extends z.ZodType>(schema: S, data: unknown, what: string): z.infer<S> {
	const result = schema.safeParse(data);
	if (!result.success) throw new UnexpectedAnswerError(what);
	return result.data;
}

/** Checks `data` against `schema` and hands back the same value under its own (richer) type. */
export function verified<T>(schema: z.ZodType, data: T, what: string): T {
	checked(schema, data, what);
	return data;
}
