/**
 * How the Open Care plans are worded on the public pricing page. Prices and which features a plan includes come from
 * the API (`GET /api/plans`), so there is one place to change them. This file only holds the words: the names, the
 * taglines and the text of each feature key.
 *
 * Every audience has the same three plans (Free, Plus, Pro). Plan names describe what is included; they never rank
 * a provider. Nothing is sold yet: paid plans are a waitlist, and a feature marked roadmap is planned, not built.
 * The reference for the numbers is `opencare/docs/PRICING_MODEL.md`.
 */
export type Tier = "FREE" | "PLUS" | "PRO";
export type ApiAudience = "DOCTOR" | "HOSPITAL" | "CLINIC" | "PATIENT";
export type AudienceId = "patients" | "doctors" | "hospitals";

/** A plan as `GET /api/plans` returns it. */
export interface ApiPlan {
	audience: ApiAudience;
	tier: Tier;
	priceBdt: number;
	billingPeriod: string | null;
	features: string[];
}

export interface FeatureCopy {
	text: string;
	/** Planned, not available yet. */
	roadmap?: boolean;
}

/** The text of every feature key, in the order features are listed. A key the API sends that is missing here is not shown. */
export const FEATURE_COPY: Record<string, FeatureCopy> = {
	// everyone
	DIRECTORY_LISTING: { text: "Listing in the Open Care directory" },
	PROFILE_SELF_EDIT: { text: "Edit your own profile or listing in the Open Care console" },
	EMERGENCY_INFO: { text: "Emergency, ambulance and blood bank information" },
	CONTACT_VERIFICATION: { text: "Claimed and verified contact details", roadmap: true },
	// patients
	DIRECTORY_SEARCH: { text: "Search doctors, hospitals, ambulances and blood services" },
	CONSENT_MANAGEMENT: { text: "Approve or decline a doctor's request to write your prescription, and take your consent back any time" },
	HEALTH_VITALS: { text: "Health vitals tracking" },
	REPORT_STORAGE: { text: "Secure storage for your reports", roadmap: true },
	REPORT_ANALYSIS: { text: "Free report analysis", roadmap: true },
	DASHBOARD_WIDGETS: { text: "Custom health dashboard widgets and insights", roadmap: true },
	FAMILY_SHARING: { text: "Share prescriptions and reports with family, with your consent", roadmap: true },
	VIDEO_CONSULTATION_MEMBER_RATE: { text: "Member rate on per-visit video consultation (rate to be set)", roadmap: true },
	// doctors
	PRESCRIPTIONS: { text: "Write prescriptions for patients who consent" },
	PRACTICE_DASHBOARD: { text: "Your own practice dashboard: prescriptions, patients and follow-ups" },
	PROFILE_LANDING_PAGE: { text: "Doctor profile landing page" },
	WHATSAPP_BOOKING_LINK: { text: "WhatsApp pre-filled booking link" },
	TRUST_BADGES: { text: "Trust chips and verification badges" },
	QR_VCARD: { text: "QR code and vCard download" },
	MULTIPLE_LOCATIONS: { text: "Multiple practice locations and schedules" },
	REVIEWS_FAQ: { text: "Reviews and FAQ sections" },
	LANGUAGE_TOGGLE: { text: "Language toggle (EN/BN)" },
	FACEBOOK_HIGHLIGHT: { text: "Highlighted on the Open Care Facebook page, marked as a featured doctor", roadmap: true },
	// hospitals, clinics and diagnostic centres
	LANDING_PAGE: { text: "Landing page with overview and contact blocks" },
	SERVICES_LISTING: { text: "Departments, services and facilities" },
	TEST_PRICE_LIST: { text: "Test list with prices and report turnaround" },
	MAP_DIRECTIONS: { text: "Map and directions button" },
	FEATURED_DOCTORS: { text: "Featured doctors section" },
	ACCREDITATION_BADGES: { text: "Insurance and accreditation badges" },
	STATS_HIGHLIGHTS: { text: "Hospital stats and performance highlights" },
	ENQUIRY_ANALYTICS: { text: "Enquiry analytics: views, calls and directions", roadmap: true },
	// shared paid features
	BLOOD_DONOR_LIST: { text: "Blood donor list (blood banks and blood requests stay free)" },
	SMS_EMAIL_NOTIFICATIONS: { text: "SMS and email notifications (follow-up reminders and enquiry alerts)", roadmap: true },
	SEARCH_PRIORITY: { text: "Priority placement in public search, clearly labelled as featured", roadmap: true },
};

export interface TierCopy {
	tagline: string;
	bestFor: string;
	highlight?: boolean;
}

export interface AudienceCopy {
	id: AudienceId;
	label: string;
	headline: string;
	/** The API audiences behind this tab. The first one decides which features are listed; each adds a price line when there are several. */
	apiAudiences: ApiAudience[];
	/** Label for each price line when a tab covers more than one API audience. */
	priceLabels: Partial<Record<ApiAudience, string>>;
	tiers: Record<Tier, TierCopy>;
}

export const AUDIENCES: AudienceCopy[] = [
	{
		id: "patients",
		label: "Patients",
		headline: "Finding care stays free. Extras when you want them.",
		apiAudiences: ["PATIENT"],
		priceLabels: {},
		tiers: {
			FREE: { tagline: "Find care and keep your health information in one place.", bestFor: "Everyone" },
			PLUS: {
				tagline: "Keep your reports safe, understand them, and share them with family.",
				bestFor: "People managing long-term or family health",
				highlight: true,
			},
			PRO: { tagline: "Plus, with a member rate when you want to see a doctor on video.", bestFor: "People who consult doctors often" },
		},
	},
	{
		id: "doctors",
		label: "Doctors",
		headline: "Prescribe and be found for free. Turn profile views into booked visits with Plus and Pro.",
		apiAudiences: ["DOCTOR"],
		priceLabels: {},
		tiers: {
			FREE: { tagline: "Be found in the Open Care directory and prescribe at no cost.", bestFor: "Every registered doctor" },
			PLUS: { tagline: "A clean, credible profile page and reminders that bring patients back.", bestFor: "New practices and solo doctors" },
			PRO: {
				tagline: "Conversion-focused features that book more patients.",
				bestFor: "Busy clinics and high-volume specialists",
				highlight: true,
			},
		},
	},
	{
		id: "hospitals",
		label: "Hospitals",
		headline: "List your facility for free. Add a landing page, your test prices and trust signals with Plus and Pro.",
		apiAudiences: ["CLINIC", "HOSPITAL"],
		priceLabels: { CLINIC: "Clinics and diagnostic centres", HOSPITAL: "Hospitals" },
		tiers: {
			FREE: {
				tagline: "Be found in the Open Care directory at no cost. Emergency, ambulance and blood bank details are always free.",
				bestFor: "Every registered hospital, clinic, diagnostic centre and blood bank",
			},
			PLUS: { tagline: "A landing page with your services, tests and prices.", bestFor: "Private clinics, diagnostic centres and community hospitals" },
			PRO: {
				tagline: "More patients reach you, and you can see how.",
				bestFor: "Busy private hospitals, referral centres and diagnostic chains",
				highlight: true,
			},
		},
	},
];

export const audienceById = (id: string | undefined): AudienceCopy => AUDIENCES.find((audience) => audience.id === id) ?? AUDIENCES[0];
