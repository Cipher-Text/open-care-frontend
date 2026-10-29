import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/** Growth loop: the people best placed to correct a listing are the doctors and facilities in it. */
export default function ForProfessionals() {
	const t = useTranslations("home.pro");
	return (
		<section aria-labelledby="pro-title" className="bg-primary py-14 sm:py-16">
			<div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
				<h2 id="pro-title" className="text-2xl font-bold text-primary-foreground sm:text-3xl">
					{t("title")}
				</h2>
				<p className="max-w-2xl text-lg text-primary-foreground/90">{t("text")}</p>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button asChild size="lg" variant="secondary" className="h-12 px-8">
						<NextLink href="/signup">{t("create")}</NextLink>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="h-12 border-primary-foreground bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
					>
						<a href={`mailto:hello@opencarebd.com?subject=${encodeURIComponent(t("subject"))}`}>{t("update")}</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
