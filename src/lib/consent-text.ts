/**
 * The wording of the screens where a person gives an agreement (health data, blood donor listing, a doctor's request to write
 * a prescription), in English and Bangla side by side. The signed-in screens are English only otherwise, but a person must be
 * able to read what they agree to in their own language, so these are shown in both. The Bangla was written by the team and
 * needs a native reader's review (`docs/features/profiles-and-accounts.md`).
 */
export interface Bilingual {
	en: string;
	bn: string;
}

export const CONSENT = {
	choice: {
		en: "Your choice. You can change it any time.",
		bn: "এটি আপনার সিদ্ধান্ত। যেকোনো সময় বদলাতে পারবেন।",
	},
	healthAgree: {
		en: "I agree that Open Care may store my health vitals (such as blood pressure, glucose and weight). Without this, new vitals cannot be saved.",
		bn: "আমি সম্মতি দিচ্ছি যে ওপেন কেয়ার আমার স্বাস্থ্যের তথ্য (যেমন রক্তচাপ, রক্তে শর্করা ও ওজন) সংরক্ষণ করতে পারবে। সম্মতি না দিলে নতুন তথ্য সংরক্ষণ করা যাবে না।",
	},
	healthWithdraw: {
		en: "If you withdraw, nothing is deleted: vitals already saved stay visible to you, and you can delete them yourself.",
		bn: "সম্মতি প্রত্যাহার করলে কিছু মুছে যাবে না: আগে সংরক্ষিত তথ্য আপনি দেখতে পাবেন এবং নিজেই মুছে ফেলতে পারবেন।",
	},
	donorAgree: {
		en: "I am willing to donate blood, and I agree to be listed as a blood donor. People with a Plus or Pro plan, and Open Care staff who manage blood, can see my name, blood group and area.",
		bn: "আমি রক্ত দিতে ইচ্ছুক এবং রক্তদাতা হিসেবে তালিকাভুক্ত হতে সম্মতি দিচ্ছি। প্লাস বা প্রো প্ল্যানের সদস্যরা এবং রক্ত ব্যবস্থাপনার দায়িত্বে থাকা ওপেন কেয়ারের কর্মীরা আমার নাম, রক্তের গ্রুপ ও এলাকা দেখতে পারবেন।",
	},
	donorShare: {
		en: "Only share what you are comfortable with. Your email is never shown.",
		bn: "যতটুকু দিতে স্বচ্ছন্দ, ততটুকুই দেখান। আপনার ইমেইল কখনোই দেখানো হয় না।",
	},
	donorPhone: { en: "Show my phone number", bn: "আমার ফোন নম্বর দেখান" },
	donorAddress: { en: "Show my address", bn: "আমার ঠিকানা দেখান" },
	rxOnlyIf: {
		en: "Only agree if you are with this doctor right now.",
		bn: "শুধু তখনই সম্মতি দিন, যখন আপনি এই ডাক্তারের সাথে আছেন।",
	},
	agree: { en: "Agree", bn: "সম্মতি দিন" },
	decline: { en: "Decline", bn: "প্রত্যাখ্যান করুন" },
} satisfies Record<string, Bilingual>;

/** A doctor asking to write a prescription, with the doctor's name in both languages of the sentence. */
export function prescriptionRequest(doctorName: string | null | undefined): Bilingual {
	const name = doctorName?.trim();
	return {
		en: `${name || "A doctor"} wants to write a prescription for you`,
		bn: `${name || "একজন ডাক্তার"} আপনার জন্য প্রেসক্রিপশন লিখতে চান`,
	};
}
