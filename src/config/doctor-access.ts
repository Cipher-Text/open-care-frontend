/**
 * Who may change a doctor record in the console. Mirrors the API (`DoctorAccess`): a doctor holds `update-doctor` but
 * may change only their own record; anyone who creates, deletes or verifies doctors may change any. The API is the real
 * lock, this only decides what to show.
 */
export const canManageDoctors = (has: (permission: string) => boolean): boolean =>
	has("create-doctor") || has("delete-doctor") || has("verify-doctor");

export const canEditDoctor = (has: (permission: string) => boolean, doctorId: number, myDoctorId?: number): boolean =>
	has("update-doctor") && (canManageDoctors(has) || myDoctorId === doctorId);
