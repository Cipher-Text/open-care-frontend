"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyDoctor } from "@/hooks/use-my-doctor";

/** "My doctor profile": opens the signed-in doctor's own record for editing. */
export default function MyDoctorProfilePage() {
	const router = useRouter();
	const { data, isError, error } = useMyDoctor();

	useEffect(() => {
		if (data) router.replace(`/admin/doctors/${data.id}`);
	}, [data, router]);

	if (isError) {
		return (
			<div className="p-4 md:p-8">
				<Alert>
					<AlertDescription>{(error as Error).message}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return <Skeleton className="m-8 h-8 w-64" />;
}
