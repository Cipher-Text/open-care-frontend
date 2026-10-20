import type { Metadata } from "next";
import InfoPage, { CONTACT_EMAIL } from "@/components/common/InfoPage";

export const metadata: Metadata = {
	title: "Terms of use | Open Care",
	description: "The rules for using Open Care.",
};

export default function TermsPage() {
	return (
		<InfoPage title="Terms of use" description="Please read these before using Open Care." updated="21 October 2026">
			<section>
				<h2>Information only</h2>
				<p>
					Open Care is a directory. Nothing on it is medical advice, a diagnosis or a recommendation of treatment.
					Always consult a qualified health professional. In an emergency, call 999.
				</p>
			</section>

			<section>
				<h2>Accuracy</h2>
				<p>
					Listings may be incomplete, out of date or wrong. We try to correct mistakes quickly but do not guarantee
					that any listing is accurate, current or that a facility or doctor is available. Please confirm details
					with the facility before you travel or rely on them.
				</p>
			</section>

			<section>
				<h2>Using the site</h2>
				<ul>
					<li>Do not misuse the site, attempt to break or overload it, or collect its data in bulk without permission.</li>
					<li>Do not post false, misleading or unlawful information.</li>
					<li>Keep your account details accurate and your password private.</li>
				</ul>
			</section>

			<section>
				<h2>Accounts</h2>
				<p>
					You are responsible for activity under your account. We may suspend accounts that break these terms or
					that supply false information, for example someone claiming to be a doctor or facility they are not.
				</p>
			</section>

			<section>
				<h2>Third-party listings and links</h2>
				<p>
					Open Care lists independent hospitals, doctors and organisations and links to their websites. We do not
					operate them and are not responsible for their services or content.
				</p>
			</section>

			<section>
				<h2>Limits of liability</h2>
				<p>
					Open Care is provided as is and free of charge. To the extent the law allows, we are not liable for loss
					or harm that results from relying on information in the directory.
				</p>
			</section>

			<section>
				<h2>Changes and contact</h2>
				<p>
					We may update these terms and will show the date above. Questions? Email{" "}
					<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. These terms are governed by the laws of Bangladesh.
				</p>
			</section>
		</InfoPage>
	);
}
