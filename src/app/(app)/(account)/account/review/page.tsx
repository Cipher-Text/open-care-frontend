"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReview, fetchMyReviews, fetchReviewEligibility, updateReview } from "@/api/reviews";
import { Stars } from "@/components/reviews/Stars";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

/** Choose 1 to 5; clicking the chosen star again clears an optional score. */
function StarPicker({ label, value, onChange, optional = false }: { label: string; value: number | null; onChange: (v: number | null) => void; optional?: boolean }) {
	return (
		<div className="space-y-1">
			<Label>{label}{optional ? " (optional)" : ""}</Label>
			<div className="flex gap-1" role="radiogroup" aria-label={label}>
				{[1, 2, 3, 4, 5].map((n) => (
					<button
						key={n}
						type="button"
						role="radio"
						aria-checked={value === n}
						aria-label={`${n} star${n > 1 ? "s" : ""}`}
						className={`text-2xl leading-none ${value != null && n <= value ? "text-amber-500" : "text-muted-foreground/40"}`}
						onClick={() => onChange(optional && value === n ? null : n)}
					>
						★
					</button>
				))}
			</div>
		</div>
	);
}

function ReviewForm() {
	const router = useRouter();
	const params = useSearchParams();
	const doctor = params.get("doctor");
	const editing = params.get("edit");
	const valid = !!doctor && /^\d+$/.test(doctor);

	const eligibility = useQuery({ queryKey: ["review-eligibility", doctor], queryFn: () => fetchReviewEligibility(doctor as string), enabled: valid && !editing, retry: false });
	const mine = useQuery({ queryKey: ["my-reviews", 1], queryFn: () => fetchMyReviews(1, 100), enabled: !!editing, retry: false });
	const existing = editing ? mine.data?.content.find((r) => String(r.id) === editing) : undefined;

	const [overall, setOverall] = useState<number | null>(null);
	const [scores, setScores] = useState<Record<string, number | null>>({ scoreExplanation: null, scoreTime: null, scoreListening: null, scoreBehaviour: null });
	const [recommend, setRecommend] = useState<boolean | null>(null);
	const [comment, setComment] = useState("");
	const [loaded, setLoaded] = useState(false);

	// start from the saved review when editing
	if (existing && !loaded) {
		setOverall(existing.overall);
		setScores({ scoreExplanation: existing.scoreExplanation, scoreTime: existing.scoreTime, scoreListening: existing.scoreListening, scoreBehaviour: existing.scoreBehaviour });
		setRecommend(existing.wouldRecommend);
		setComment(existing.comment ?? "");
		setLoaded(true);
	}

	const send = useMutation({
		mutationFn: () => {
			const body = {
				overall: overall as number,
				scoreExplanation: scores.scoreExplanation ?? undefined,
				scoreTime: scores.scoreTime ?? undefined,
				scoreListening: scores.scoreListening ?? undefined,
				scoreBehaviour: scores.scoreBehaviour ?? undefined,
				wouldRecommend: recommend as boolean,
				comment: comment || undefined,
				language: "en",
			};
			return editing ? updateReview(Number(editing), body) : createReview({ ...body, doctorId: Number(doctor) });
		},
		onSuccess: () => {
			toast.success("Thank you. A moderator will check your review before it appears.");
			router.push("/account/reviews");
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not send your review"),
	});

	if (!valid && !editing) {
		return (
			<Alert>
				<AlertDescription>Open a doctor&apos;s page in the directory and choose &quot;Write a review&quot;.</AlertDescription>
			</Alert>
		);
	}

	if (!editing && eligibility.isLoading) return <Skeleton className="h-40 w-full max-w-2xl" />;
	if (!editing && eligibility.data && !eligibility.data.eligible) {
		return (
			<Alert className="max-w-2xl">
				<AlertDescription>
					{eligibility.data.message}. <Link href="/account/reviews" className="underline">My reviews</Link>
				</AlertDescription>
			</Alert>
		);
	}
	if (!editing && eligibility.isError) {
		return (
			<Alert variant="destructive" className="max-w-2xl">
				<AlertDescription>{eligibility.error instanceof Error ? eligibility.error.message : "Could not check whether you can review"}</AlertDescription>
			</Alert>
		);
	}

	return (
		<Card className="max-w-2xl">
			<CardHeader>
				<CardTitle className="text-base">{editing ? "Change your review" : "Write a review"}</CardTitle>
				<CardDescription>
					Review the visit: how the doctor explained, listened and behaved. Do not write whether the treatment worked, and leave out phone numbers, links and other people&apos;s names. A moderator checks it before it appears, without your name.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<StarPicker label="Overall" value={overall} onChange={setOverall} />
				<div className="grid gap-4 sm:grid-cols-2">
					<StarPicker optional label="Explained clearly" value={scores.scoreExplanation} onChange={(v) => setScores((s) => ({ ...s, scoreExplanation: v }))} />
					<StarPicker optional label="Time for the patient" value={scores.scoreTime} onChange={(v) => setScores((s) => ({ ...s, scoreTime: v }))} />
					<StarPicker optional label="Listened carefully" value={scores.scoreListening} onChange={(v) => setScores((s) => ({ ...s, scoreListening: v }))} />
					<StarPicker optional label="Friendly behaviour" value={scores.scoreBehaviour} onChange={(v) => setScores((s) => ({ ...s, scoreBehaviour: v }))} />
				</div>
				<div className="space-y-1">
					<Label>Would you recommend this doctor?</Label>
					<div className="flex gap-2">
						<Button type="button" size="sm" variant={recommend === true ? "default" : "outline"} onClick={() => setRecommend(true)}>Yes</Button>
						<Button type="button" size="sm" variant={recommend === false ? "default" : "outline"} onClick={() => setRecommend(false)}>No</Button>
					</div>
				</div>
				<div className="space-y-1">
					<Label htmlFor="review-comment">Your comment (optional)</Label>
					<Textarea id="review-comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} rows={4} />
					<p className="text-xs text-muted-foreground">{comment.length}/500</p>
				</div>
				<div className="flex items-center gap-3">
					<Button onClick={() => send.mutate()} disabled={send.isPending || overall == null || recommend == null}>
						{send.isPending ? "Sending..." : editing ? "Save" : "Send for checking"}
					</Button>
					{overall != null && <Stars value={overall} />}
				</div>
			</CardContent>
		</Card>
	);
}

export default function ReviewPage() {
	return (
		<Suspense fallback={null}>
			<ReviewForm />
		</Suspense>
	);
}
