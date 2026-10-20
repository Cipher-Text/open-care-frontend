import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Growth loop: the people best placed to correct a listing are the doctors and facilities in it. */
export default function ForProfessionals() {
	return (
		<section aria-labelledby="pro-title" className="bg-primary py-14 sm:py-16">
			<div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
				<h2 id="pro-title" className="text-2xl font-bold text-primary-foreground sm:text-3xl">
					Are you a doctor or run a health facility?
				</h2>
				<p className="max-w-2xl text-lg text-primary-foreground/90">
					Create an account to keep your details accurate. Claiming a listing and verification are rolling
					out, and registered accounts are the first to be invited.
				</p>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button asChild size="lg" variant="secondary" className="h-12 px-8">
						<Link href="/signup">Create an account</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="h-12 border-primary-foreground bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
					>
						<a href="mailto:hello@opencarebd.com?subject=Update%20my%20listing">Ask us to update a listing</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
