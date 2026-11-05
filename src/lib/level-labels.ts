/** The three kinds of level a person can have. Each is a name and a number: "Contributor level 3". */
export type LevelKind = "contributor" | "bloodDonor" | "healthPartner";

const NAMES: Record<LevelKind, string> = {
	contributor: "Contributor",
	bloodDonor: "Blood Donor",
	healthPartner: "Health Partner",
};

/** The English label. The public site writes the same words in Bangla from the `levels` messages. */
export function levelLabel(kind: LevelKind, level: number): string {
	return level > 0 ? `${NAMES[kind]} level ${level}` : "No level yet";
}
