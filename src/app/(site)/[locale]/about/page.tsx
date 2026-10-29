import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { CONTACT_EMAIL } from "@/components/common/InfoPage";
import { formatCount, getHomeStats } from "@/lib/public-stats";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "About | Open Care",
	description: "Open Care is a free health directory for Bangladesh. What it offers, what it does not, and where it is going.",
};

export default async function AboutPage() {
	const stats = await getHomeStats();
	return (
		<InfoPage title="About Open Care" description="A free health directory for Bangladesh.">
			<section>
				<h2>Why Open Care exists</h2>
				<p>
					Finding a nearby clinic, a blood bank or an ambulance should not depend on who you know. Open Care brings
					health facilities, doctors and institutions across Bangladesh into one searchable, free place.
				</p>
			</section>

			<section>
				<h2>What you can do today</h2>
				<ul>
					<li>
						Search{" "}
						{stats.facilities != null ? `${formatCount(stats.facilities)} health facilities` : "health facilities"} by name,
						district and type, from community clinics to private hospitals.
					</li>
					<li>Find blood banks and ambulances, and call them directly where a number is listed.</li>
					<li>Browse medical colleges and institutions.</li>
					<li>Look up doctors by name and district.</li>
				</ul>
			</section>

			<section>
				<h2>What Open Care is not</h2>
				<p>
					Open Care is an information directory. It does not give medical advice, diagnose conditions, or recommend
					treatment, and it does not replace a doctor. In an emergency, call{" "}
					<a href="tel:999">999</a>.
				</p>
			</section>

			<section>
				<h2>About the data</h2>
				<p>
					Many listings were imported and are not yet verified, so some details may be missing or out of date. A
					verified badge appears only on records that have been reviewed. If you spot a mistake, please{" "}
					<a href={`mailto:${CONTACT_EMAIL}?subject=Incorrect%20information%20on%20Open%20Care`}>tell us</a>, and if you
					are a doctor or run a facility you can <Link href="/signup">create an account</Link> to help keep your
					details accurate.
				</p>
			</section>

			<section>
				<h2>What is coming</h2>
				<p>
					Planned work includes verified profiles for doctors and facilities, appointment booking, and a Bangla
					interface. These are plans, not promises of dates.
				</p>
			</section>

			<section>
				<h2>Who is behind it</h2>
				<p>
					Open Care is built and maintained by the Cipher Text team. Project information is on the{" "}
					<a href="https://hub.opencarebd.com" target="_blank" rel="noopener noreferrer">
						Open Care Hub
					</a>{" "}
					and the code is on{" "}
					<a href="https://github.com/Cipher-Text" target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
					.
				</p>
			</section>
		</InfoPage>
	);
}
