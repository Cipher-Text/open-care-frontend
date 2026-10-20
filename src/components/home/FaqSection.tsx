export const FAQ_ITEMS = [
	{
		q: "What is Open Care?",
		a: "A free directory that helps you find hospitals, clinics, diagnostic centers, blood banks and doctors across Bangladesh by name, district and type.",
	},
	{
		q: "Is the information verified?",
		a: "Not yet for most records. Listings were imported and some may be incomplete or out of date. A verified badge appears only on records that have been reviewed. Please confirm details by phone before you travel.",
	},
	{
		q: "Can I book an appointment here?",
		a: "Not at the moment. Open Care helps you find and contact a doctor or facility. Booking and other services are planned.",
	},
	{
		q: "How do I report a wrong or missing listing?",
		a: "Email hello@opencarebd.com with the name of the facility or doctor and what is wrong. If you are the doctor or facility, create an account so we can reach you.",
	},
	{
		q: "Does Open Care give medical advice?",
		a: "No. It is an information directory only. For medical advice see a qualified doctor, and in an emergency call 999.",
	},
];

export default function FaqSection() {
	return (
		<section aria-labelledby="faq-title" className="py-14 sm:py-16">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<h2 id="faq-title" className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
					Common questions
				</h2>
				<div className="divide-y rounded-xl border bg-card">
					{FAQ_ITEMS.map((item) => (
						<details key={item.q} className="group px-5 py-4">
							<summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 font-medium text-foreground">
								{item.q}
								<span className="text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true">
									⌄
								</span>
							</summary>
							<p className="mt-2 text-muted-foreground">{item.a}</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
