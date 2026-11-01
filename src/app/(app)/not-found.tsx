import Link from "next/link";
import { Button } from "@/components/ui/button";

/** A page of the signed-in area that does not exist (or a record that was not found). */
export default function AppNotFound() {
	return (
		<div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
			<h1 className="text-xl font-semibold">Page not found</h1>
			<p className="text-sm text-muted-foreground">The address does not exist, or it has moved.</p>
			<Button asChild>
				<Link href="/account">Go to my account</Link>
			</Button>
		</div>
	);
}
