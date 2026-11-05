/**
 * Compile-time contract between the screens and the backend. Each line below fails `tsc` (and so the build and CI) when a type the
 * screens use names a field the backend does not send, or a field whose type cannot match the backend's. The backend side is
 * generated from the OpenAPI snapshot (`npm run api:types` → `api.gen.ts`); refresh the snapshot from a running backend with
 * `npm run api:snapshot` when the API changes. Add a line here for every new response type a screen reads.
 */
import type { BulkResponse, BulkRowResult } from "@/api/bulk-upload";
import type { Capabilities } from "@/api/capabilities";
import type { DuplicateCandidate } from "@/api/duplicates";
import type { LocationSuggestion } from "@/api/location-suggestions";
import type { Delivery } from "@/api/notification-deliveries";
import type { Appointment, SlotList } from "@/api/appointments";
import type { ConsentRequest, DoctorGrant, PatientLookup } from "@/types/consents";
import type { components } from "@/types/api.gen";

type S = components["schemas"];

/**
 * A type with every field optional and without null, all the way down. The OpenAPI document cannot say which fields are always
 * there or may be null, so both sides are compared in this loose form: what is checked is that the names exist and the kinds of
 * value match.
 */
type Loose<T> = T extends readonly (infer E)[]
	? Loose<E>[]
	: T extends object
		? { [K in keyof T]?: Loose<Exclude<T[K], null | undefined>> }
		: Exclude<T, null | undefined>;
type Field<T> = Loose<Exclude<T, null | undefined>>;

/** The fields of `Local` that `Remote` lacks or types incompatibly (either type may be the narrower one). Must be `never`. */
export type Mismatch<Local, Remote> = {
	[K in keyof Local]-?: K extends keyof Remote
		? Field<Remote[K]> extends Field<Local[K]>
			? never
			: Field<Local[K]> extends Field<Remote[K]>
				? never
				: K
		: K;
}[keyof Local];

type Agrees<T extends never> = T;

export type Contract = [
	Agrees<Mismatch<LocationSuggestion, S["LocationSuggestionResponse"]>>,
	Agrees<Mismatch<DuplicateCandidate, S["DuplicateCandidate"]>>,
	Agrees<Mismatch<BulkRowResult, S["BulkRowResult"]>>,
	Agrees<Mismatch<BulkResponse, S["BulkResponse"]>>,
	Agrees<Mismatch<Delivery, S["NotificationDeliveryResponse"]>>,
	Agrees<Mismatch<Appointment, S["AppointmentResponse"]>>,
	Agrees<Mismatch<SlotList, S["SlotResponse"]>>,
	Agrees<Mismatch<ConsentRequest, S["ConsentRequestResponse"]>>,
	Agrees<Mismatch<PatientLookup, S["PatientLookupResponse"]>>,
	Agrees<Mismatch<DoctorGrant, S["DoctorGrantResponse"]>>,
	Agrees<Mismatch<Capabilities, S["CapabilitiesResponse"]>>,
];

/** The check itself is checked: these must be refused (if `tsc` stops refusing them, the comments below fail the build). */
export type ContractSelfTest = [
	// @ts-expect-error a field the backend does not have
	Agrees<Mismatch<{ id: number; nickname: string }, S["DuplicateCandidate"]>>,
	// @ts-expect-error a field with another kind of value (the backend sends a number)
	Agrees<Mismatch<{ id: string }, S["DuplicateCandidate"]>>,
	// @ts-expect-error a nested field the backend does not have
	Agrees<Mismatch<{ rows: { colour: string }[] }, S["BulkResponse"]>>,
];
