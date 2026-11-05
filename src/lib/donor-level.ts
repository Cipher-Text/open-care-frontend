import { levelLabel } from "@/lib/level-labels";
import type { BloodDonationBadge } from "@/types/profile";

/** A donor's level is a number from 1 to 10 (0 before the first donation); the words come from the `bloodDonor` messages. */
export const MAX_DONOR_LEVEL = 10;

export function donorLevelLabel(badge: Pick<BloodDonationBadge, "level">): string {
	return badge.level > 0 ? levelLabel("bloodDonor", badge.level) : "New donor";
}
