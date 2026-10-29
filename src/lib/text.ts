/** Names from imported data can carry leading spaces and zero-width characters; show them cleaned. */
export function displayName(value?: string | null): string {
	return (value ?? "")
		.replace(/[​-‍⁠﻿]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}
