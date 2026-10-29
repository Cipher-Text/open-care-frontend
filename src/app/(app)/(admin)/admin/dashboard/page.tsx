import { redirect } from "next/navigation";

/** The Admin Dashboard is now part of the one Dashboard at /admin (shown to the super admin). */
export default function AdminDashboardRedirect() {
	redirect("/admin");
}
