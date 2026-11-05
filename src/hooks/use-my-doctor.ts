"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { fetchMyDoctor } from "@/api/doctors";
import { usePermissions } from "@/hooks/use-permissions";

/** The signed-in doctor's own record (undefined for everyone who is not a doctor). */
export const useMyDoctor = () => {
	const { hasPermission } = usePermissions();
	return useQuery({
		queryKey: [...qk.myDoctor],
		queryFn: fetchMyDoctor,
		enabled: hasPermission("view-doctor-panel"),
		staleTime: 5 * 60 * 1000,
		retry: false,
	});
};
