import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
	return (
		<section className="bg-primary py-14 sm:py-20">
			<div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
				<h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
					Start with the directory
				</h2>
				<p className="mb-8 text-lg text-primary-foreground/90">
					Open Care provides information only and is not a substitute for medical
					advice. In an emergency, contact your local emergency services.
				</p>
				<div className="flex flex-col justify-center gap-3 sm:flex-row">
					<Button asChild size="lg" variant="secondary" className="h-12">
						<Link href="/doctors">Find a doctor</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="h-12 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
					>
						<Link href="/hospitals">Find a hospital</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
