import type { Metadata } from "next";
import InfoPage, { CONTACT_EMAIL } from "@/components/common/InfoPage";

export const metadata: Metadata = {
	title: "Privacy policy | Open Care",
	description: "What information Open Care collects, why, and the choices you have.",
};

export default function PrivacyPage() {
	return (
		<InfoPage title="Privacy policy" description="What we collect, why, and your choices." updated="21 October 2026">
			<section>
				<h2>Browsing the directory</h2>
				<p>
					You can search hospitals, clinics, doctors, ambulances and institutions without an account. We do not ask
					for your name or contact details to search.
				</p>
			</section>

			<section>
				<h2>Information we collect</h2>
				<ul>
					<li>
						<strong>Account details</strong> if you sign up: your name, email address, phone number, and the
						other details you choose to enter in your profile.
					</li>
					<li>
						<strong>Sign-in data</strong>: tokens kept in secure cookies and in your browser so you stay signed in
						until you log out or the session expires.
					</li>
					<li>
						<strong>Usage data</strong>: pages visited and basic device and browser information, collected with
						Google Analytics to understand how the site is used.
					</li>
					<li>
						<strong>Messages</strong> you send to us by email.
					</li>
				</ul>
			</section>

			<section>
				<h2>Health information</h2>
				<p>
					The public directory does not ask for your health information. If you use features that store health
					details in your account, they are kept private to your account and are shared only where you have given
					consent.
				</p>
			</section>

			<section>
				<h2>How we use information</h2>
				<ul>
					<li>To run the directory and your account.</li>
					<li>To correct listings and respond to messages.</li>
					<li>To measure and improve the site.</li>
				</ul>
				<p>We do not sell your personal information.</p>
			</section>

			<section>
				<h2>Public listings</h2>
				<p>
					Listings for hospitals, clinics, doctors and other organisations come from public records and
					contributions. If you are listed and want something corrected or removed, email{" "}
					<a href={`mailto:${CONTACT_EMAIL}?subject=Listing%20correction%20or%20removal`}>{CONTACT_EMAIL}</a>.
				</p>
			</section>

			<section>
				<h2>Cookies</h2>
				<p>
					We use cookies that keep you signed in, and analytics cookies. You can block cookies in your browser
					settings, but sign-in will not work without the sign-in cookies.
				</p>
			</section>

			<section>
				<h2>Your choices</h2>
				<p>
					You can ask to see, correct or delete the personal information in your account by emailing{" "}
					<a href={`mailto:${CONTACT_EMAIL}?subject=My%20account%20data`}>{CONTACT_EMAIL}</a>.
				</p>
			</section>

			<section>
				<h2>Changes</h2>
				<p>We will update this page when our practices change, and show the date above.</p>
			</section>
		</InfoPage>
	);
}
