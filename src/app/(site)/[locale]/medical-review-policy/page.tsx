import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import InfoPage, { CONTACT_EMAIL } from "@/components/common/InfoPage";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "মেডিকেল রিভিউ নীতিমালা | Open Care",
	description: "Open Care-এর স্বাস্থ্য বিষয়ক লেখা কীভাবে তৈরি, পর্যালোচনা ও আপডেট করা হয়।",
	// The text exists in Bangla only, at both addresses: the English address is the one for search
	alternates: { canonical: "/medical-review-policy" },
};

export default async function MedicalReviewPolicyPage({ params }: { params: Promise<{ locale: Locale }> }) {
	const { locale } = await params;
	setRequestLocale(locale);
	return (
		<InfoPage
			title="মেডিকেল রিভিউ নীতিমালা"
			description="স্বাস্থ্য বিষয়ক লেখা কীভাবে তৈরি, পর্যালোচনা ও আপডেট করা হয়"
			updated="30 October 2026"
		>
			<section>
				<p>
					Open Care-এর <Link href="/blog">স্বাস্থ্য বিষয়ক লেখা</Link> নির্ভরযোগ্য, প্রমাণভিত্তিক ও দায়িত্বশীলভাবে উপস্থাপন
					করা আমাদের অঙ্গীকার। এই নীতিমালা ব্যাখ্যা করে কীভাবে আমাদের কনটেন্ট তৈরি, পর্যালোচনা ও আপডেট করা হয়।
				</p>
			</section>

			<section>
				<h2>কনটেন্ট প্রস্তুত প্রক্রিয়া</h2>
				<p>আমাদের স্বাস্থ্য বিষয়ক কনটেন্ট:</p>
				<ul>
					<li>সংশ্লিষ্ট বিষয়ের চিকিৎসক বা বিশেষজ্ঞ দ্বারা প্রস্তুত, অথবা</li>
					<li>চিকিৎসা বিষয়ে অভিজ্ঞ লেখক দ্বারা প্রস্তুত এবং চিকিৎসক দ্বারা পর্যালোচিত।</li>
				</ul>
			</section>

			<section>
				<h2>তথ্যের উৎস</h2>
				<p>আমরা নিম্নলিখিত উৎস থেকে তথ্য যাচাই করি:</p>
				<ul>
					<li>আন্তর্জাতিকভাবে স্বীকৃত মেডিকেল গাইডলাইন</li>
					<li>WHO ও অন্যান্য স্বীকৃত সংস্থার নির্দেশিকা</li>
					<li>প্রমাণভিত্তিক গবেষণা ও ক্লিনিক্যাল তথ্য</li>
					<li>জাতীয় স্বাস্থ্য নীতিমালা ও প্রাসঙ্গিক প্রেক্ষাপট (বাংলাদেশ)</li>
				</ul>
			</section>

			<section>
				<h2>কনটেন্ট আপডেট নীতি</h2>
				<p>
					স্বাস্থ্য নির্দেশিকা সময়ের সাথে পরিবর্তিত হতে পারে, তাই আমরা নিয়মিতভাবে গুরুত্বপূর্ণ কনটেন্ট আপডেট করার চেষ্টা
					করি। কোনো তথ্য ভুল বা পুরনো মনে হলে আমাদের জানান:{" "}
					<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
				</p>
			</section>

			<section>
				<h2>গুরুত্বপূর্ণ ঘোষণা</h2>
				<p>Open Care-এ প্রদত্ত স্বাস্থ্য বিষয়ক লেখা:</p>
				<ul>
					<li>শুধুমাত্র শিক্ষামূলক ও সচেতনতামূলক উদ্দেশ্যে</li>
					<li>সরাসরি চিকিৎসা পরামর্শের বিকল্প নয়</li>
				</ul>
				<p>
					কোনো গুরুতর বা জরুরি লক্ষণ দেখা দিলে নিকটস্থ চিকিৎসক বা হাসপাতালের সাথে যোগাযোগ করুন। জরুরি অবস্থায় <a href="tel:999">৯৯৯</a>-এ কল করুন।
				</p>
			</section>

			<section>
				<h2>সম্পাদকীয় স্বাধীনতা</h2>
				<p>
					আমাদের সম্পাদকীয় টিম বাণিজ্যিক প্রভাব থেকে স্বাধীনভাবে কনটেন্ট তৈরি করে। চিকিৎসা বিষয়ক তথ্য বিজ্ঞাপন বা
					বাণিজ্যিক স্বার্থ দ্বারা প্রভাবিত হয় না।
				</p>
			</section>
		</InfoPage>
	);
}
