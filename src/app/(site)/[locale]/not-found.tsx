import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** A public page or record that does not exist (a doctor or hospital slug that matches nothing, for example). */
export default async function SiteNotFound() {
	const t = await getTranslations("errorPages");
	return (
		<div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-3 px-4 py-12 text-center">
			<h1 className="text-xl font-semibold">{t("notFoundTitle")}</h1>
			<p className="text-sm text-muted-foreground">{t("notFoundBody")}</p>
			<Button asChild>
				<Link href="/">{t("home")}</Link>
			</Button>
		</div>
	);
}
