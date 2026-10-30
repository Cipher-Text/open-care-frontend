import { AlertCircle, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
	const t = useTranslations("common");
	return (
		<div className="space-y-4" role="status" aria-label={t("loadingResults")}>
			{Array.from({ length: rows }).map((_, i) => (
				<div
					key={i}
					className="flex gap-4 rounded-xl border border-border bg-card p-6"
				>
					<Skeleton className="size-16 shrink-0 rounded-lg" />
					<div className="flex-1 space-y-3">
						<Skeleton className="h-5 w-2/3" />
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				</div>
			))}
			<span className="sr-only">{t("loading")}</span>
		</div>
	);
}

export function EmptyState({
	title,
	description,
	onClear,
}: {
	title?: string;
	description?: string;
	onClear?: () => void;
}) {
	const t = useTranslations("common");
	return (
		<div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
			<SearchX
				className="mx-auto mb-4 size-10 text-muted-foreground"
				aria-hidden="true"
			/>
			<h3 className="text-lg font-semibold text-foreground">{title ?? t("noResults")}</h3>
			<p className="mt-1 text-muted-foreground">{description ?? t("noResultsHint")}</p>
			{onClear && (
				<Button variant="outline" className="mt-5 h-11" onClick={onClear}>
					{t("clearFilters")}
				</Button>
			)}
		</div>
	);
}

export function ErrorState({
	onRetry,
	message,
}: {
	onRetry?: () => void;
	message?: string;
}) {
	const t = useTranslations("common");
	return (
		<div
			role="alert"
			className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
		>
			<AlertCircle
				className="mx-auto mb-4 size-10 text-destructive"
				aria-hidden="true"
			/>
			<h3 className="text-lg font-semibold text-foreground">
				{t("errorTitle")}
			</h3>
			<p className="mt-1 text-muted-foreground">{message ?? t("errorMessage")}</p>
			{onRetry && (
				<Button className="mt-5 h-11" onClick={onRetry}>
					{t("tryAgain")}
				</Button>
			)}
		</div>
	);
}
