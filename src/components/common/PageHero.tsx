/** Title band used at the top of the public directory and information pages. */
export default function PageHero({ title, description }: { title: string; description?: string }) {
	return (
		<div className="bg-gradient-to-r from-primary to-primary/80 py-10 sm:py-12">
			<div className="mx-auto max-w-7xl px-4 text-center text-primary-foreground sm:px-6 lg:px-8">
				<h1 className="mb-2 text-2xl font-bold sm:text-3xl">{title}</h1>
				{description && <p className="mx-auto max-w-2xl text-base sm:text-lg">{description}</p>}
			</div>
		</div>
	);
}
