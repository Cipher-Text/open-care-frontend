const steps = [
	{ title: "Search", desc: "Type a name, specialty or hospital, or use the filters." },
	{ title: "Compare", desc: "Check location, type and details side by side." },
	{ title: "Contact", desc: "Reach the doctor or hospital directly." },
];

export default function HowItWorksSection() {
	return (
		<section className="bg-muted/50 py-14 sm:py-20">
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
				<h2 className="mb-10 text-center text-3xl font-bold text-foreground sm:text-4xl">
					How it works
				</h2>
				<ol className="grid gap-8 sm:grid-cols-3">
					{steps.map((step, i) => (
						<li key={step.title} className="text-center">
							<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
								{i + 1}
							</div>
							<h3 className="mb-1 text-xl font-bold text-foreground">
								{step.title}
							</h3>
							<p className="text-muted-foreground">{step.desc}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
