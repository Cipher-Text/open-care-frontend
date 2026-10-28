/**
 * Public page paths. Doctors and hospitals are addressed by slug; a record that has none yet
 * (an older API response) falls back to its id, which the detail route redirects to the slug.
 */
type Addressable = { id: number; slug?: string | null };

function segment(record: Addressable): string {
	const slug = record.slug?.trim();
	return slug ? encodeURIComponent(slug) : String(record.id);
}

export const doctorPath = (doctor: Addressable) => `/doctors/${segment(doctor)}`;
export const hospitalPath = (hospital: Addressable) => `/hospitals/${segment(hospital)}`;
