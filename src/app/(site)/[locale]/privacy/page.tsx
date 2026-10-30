import type { Metadata } from "next";
import InfoPage, { CONTACT_EMAIL } from "@/components/common/InfoPage";

export const metadata: Metadata = {
	title: "Privacy policy | Open Care",
	description: "What information Open Care collects, why, and the choices you have.",
};

export default function PrivacyPage() {
	return (
		<InfoPage title="Privacy policy" description="What we collect, why, and your choices." updated="31 October 2026">
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
						<strong>Anonymous page counts</strong>: how often a doctor or facility page is opened, and how often its
						call or directions button is used, kept as one number per page and day. No cookie, address or account is
						attached to these counts, and your browser&apos;s Do Not Track setting is respected.
					</li>
					<li>
						<strong>Searches that found nothing</strong>: the first 100 characters of the text, so we can learn which
						spellings fail. It is not linked to you.
					</li>
					<li>
						<strong>Verification documents</strong> if you ask to be verified as a doctor or to claim a facility: the files
						you send are kept privately, only staff who review verification can open them, and each time one is opened
						it is recorded.
					</li>
					<li>
						<strong>Questions to facilities</strong> if you ask a verified facility a question: your name, question and the phone
						number you give are sent to the facility so it can answer you, and are kept so the facility can see them.
					</li>
					<li>
						<strong>Notifications</strong> we send you about your account, such as the result of a verification request:
						they are kept in your inbox on the site and, unless you switch it off, sent to your phone number or email address.
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
