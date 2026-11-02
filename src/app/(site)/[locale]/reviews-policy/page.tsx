import type { Metadata } from "next";
import InfoPage, { CONTACT_EMAIL } from "@/components/common/InfoPage";

export const metadata: Metadata = {
	title: "Patient reviews policy | Open Care",
	description: "Who can review a doctor on Open Care, how reviews are checked, and how to report or ask for the removal of one.",
};

export default function ReviewsPolicyPage() {
	return (
		<InfoPage
			title="Patient reviews policy"
			description="How reviews of doctors work on Open Care."
			updated="2 November 2026"
		>
			<section>
				<h2>What a review is for</h2>
				<p>
					A review helps other patients choose a doctor. It is about the visit: whether the doctor explained clearly, gave time,
					listened and was friendly. It is not about whether a treatment worked, and it is not medical advice.
				</p>
			</section>

			<section>
				<h2>Who can write one</h2>
				<ul>
					<li>Only a signed-in patient who was seen by the doctor: a visit booked through Open Care and marked complete by the doctor, or a prescription the doctor wrote for them through Open Care.</li>
					<li>A doctor cannot review themselves.</li>
					<li>One review for each doctor every 6 months. You can edit your review for 7 days after you write it, and remove it at any time.</li>
				</ul>
			</section>

			<section>
				<h2>What to leave out</h2>
				<p>
					Please do not write phone numbers, links, email addresses, the names of other people, or details of your health or
					treatment. A review that includes them may be held back or removed.
				</p>
			</section>

			<section>
				<h2>How reviews are checked</h2>
				<ul>
					<li>Every new review is checked by a person at Open Care before it appears. We aim to do this within 3 working days.</li>
					<li>A computer check flags reviews that contain a phone number, a link or an email address so that the person checking looks at them closely.</li>
					<li>A review that breaks these rules is not published, or is removed later, and the reason is recorded. If yours was not published, we tell you why, and you can write another.</li>
					<li>A review you edit after it is published is checked again before the new version appears.</li>
				</ul>
			</section>

			<section>
				<h2>Who sees who wrote it</h2>
				<p>
					The public sees &quot;Verified patient&quot;, the stars, the comment and the date, never a name. The doctor cannot see who wrote a
					review. The Open Care staff who check reviews can see who wrote one and which visit it relates to, so that they can
					catch false reviews. Even so, a very specific comment can let a doctor guess who wrote it, so write with that in mind.
				</p>
			</section>

			<section>
				<h2>The doctor&apos;s reply</h2>
				<p>
					A doctor can reply once to a published review, in up to 500 characters. A doctor cannot edit, hide or remove a review,
					and cannot pay to change what is shown.
				</p>
			</section>

			<section>
				<h2>Reviews are not for sale</h2>
				<p>
					No plan, payment or advertisement changes which reviews are shown, in what order, or whether they are hidden. The
					average rating appears only once a doctor has at least 5 published reviews.
				</p>
			</section>

			<section>
				<h2>Report a review or ask for its removal</h2>
				<p>
					If you see a review that is abusive, about the wrong person, shows personal details, or is spam or an advertisement,
					use &quot;Report this review&quot; under it (you need to be signed in). A person at Open Care will look at it. You can also
					email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, give the doctor&apos;s name and the review, and say why it should be
					removed. If a review is untrue or unlawful, tell us and we will look at it promptly.
				</p>
			</section>
		</InfoPage>
	);
}
