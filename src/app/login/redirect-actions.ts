"use server";

import { redirect } from "next/navigation";

export async function redirectToAdmin() {
	redirect("/admin");
}

export async function redirectTo(path: string) {
	redirect(path);
}
