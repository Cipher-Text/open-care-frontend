"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { landingPath } from "@/config/navigation-rules";
import { permissionsFromToken } from "@/lib/token-permissions";

/** After signing in, staff go to the console and everyone else to their own account area. */
export async function redirectAfterLogin() {
	const token = (await cookies()).get("access_token")?.value;
	const permissions = permissionsFromToken(token);
	redirect(landingPath((permission) => permissions.has(permission)));
}

export async function redirectTo(path: string) {
	redirect(path);
}
