import type { Metadata } from "next";
import Link from "next/link";
import { Flag, Handshake, Mail, Stethoscope } from "lucide-react";
import InfoPage, { CONTACT_EMAIL } from "@/components/common/InfoPage";

export const metadata: Metadata = {
	title: "Contact | Open Care",
	description: "Report incorrect information, update a listing, or get in touch with the Open Care team.",
};

const ways = [
	{
		icon: Flag,
		title: "Report incorrect information",
		text: "Wrong phone number, a closed facility, a missing doctor? Include the name and what is wrong.",
		href: `mailto:${CONTACT_EMAIL}?subject=Incorrect%20information%20on%20Open%20Care`,
		label: "Email a correction",
	},
	{
		icon: Stethoscope,
		title: "Update my listing",
		text: "Doctors and facility managers: tell us what to change, or create an account so we can reach you.",
		href: `mailto:${CONTACT_EMAIL}?subject=Update%20my%20listing`,
		label: "Ask for an update",
	},
	{
		icon: Handshake,
		title: "Partnerships and press",
		text: "Health organisations, researchers and journalists are welcome to get in touch.",
		href: `mailto:${CONTACT_EMAIL}?subject=Partnership%20or%20press`,
		label: "Email the team",
	},
];

export default function ContactPage() {
	return (
		<InfoPage title="Contact us" description="We read every message and fix incorrect listings quickly.">
			<div className="grid gap-4 sm:grid-cols-3">
				{ways.map(({ icon: Icon, title, text, href, label }) => (
					<div key={title} className="flex flex-col rounded-xl border bg-card p-5">
						<Icon className="mb-3 size-6 text-primary" aria-hidden="true" />
						<h2 className="!text-lg">{title}</h2>
						<p className="mb-4 text-sm">{text}</p>
						<a href={href} className="mt-auto font-medium">
							{label}
						</a>
					</div>
				))}
			</div>

			<section>
				<h2>Email</h2>
				<p className="flex items-center gap-2">
					<Mail className="size-4" aria-hidden="true" />
					<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
				</p>
				<p>Dhaka, Bangladesh</p>
			</section>

			<section>
				<h2>In an emergency</h2>
				<p>
					Do not email. Call <a href="tel:999">999</a> right away. You can also look up an{" "}
					<Link href="/ambulances">ambulance</Link> or a <Link href="/hospitals?type=BLOOD_BANK">blood bank</Link>.
				</p>
			</section>
		</InfoPage>
	);
}
