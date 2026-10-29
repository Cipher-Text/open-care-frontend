"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBlogPost, deleteBlogPost, fetchBlogTopics, publishBlogPost, unpublishBlogPost, updateBlogPost, type BlogPostInput } from "@/api/blog-admin";
import { fetchAllMedicalSpecialities } from "@/api/medical-specialities";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost } from "@/types/blog";

const MAX_TOPICS = 5;

/** Create or edit one post. `post` is empty for a new one. Saving keeps the status; publishing is a separate action. */
export function BlogPostForm({ post }: { post?: BlogPost }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [title, setTitle] = useState(post?.title ?? "");
	const [slug, setSlug] = useState(post?.slug ?? "");
	const [summary, setSummary] = useState(post?.summary ?? "");
	const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
	const [language, setLanguage] = useState<"bn" | "en">(post?.language ?? "bn");
	const [topics, setTopics] = useState<string[]>(post?.topics.map((t) => t.name) ?? []);
	const [specialityId, setSpecialityId] = useState<string>(post?.speciality ? String(post.speciality.id) : "");
	const [bodyHtml, setBodyHtml] = useState(post?.bodyHtml ?? "");
	const [status, setStatus] = useState(post?.status);

	const topicList = useQuery({ queryKey: ["blog-topics"], queryFn: fetchBlogTopics, staleTime: 10 * 60 * 1000 });
	const specialities = useQuery({ queryKey: ["all-specialities"], queryFn: fetchAllMedicalSpecialities, staleTime: 60 * 60 * 1000 });

	const input = (): BlogPostInput => ({
		title: title.trim(),
		slug: slug.trim() || undefined,
		summary: summary.trim() || undefined,
		bodyHtml,
		coverImageUrl: coverImageUrl.trim() || undefined,
		language,
		topics,
		specialityId: specialityId ? Number(specialityId) : null,
	});

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
	const failed = (error: unknown) => toast.error(error instanceof Error ? error.message : "Something went wrong");

	const save = useMutation({
		mutationFn: () => (post ? updateBlogPost(post.id, input()) : createBlogPost(input())),
		onSuccess: (saved) => {
			toast.success("Saved");
			invalidate();
			if (!post) router.replace(`/admin/blog/${saved.id}`);
			else setSlug(saved.slug);
		},
		onError: failed,
	});
	const publish = useMutation({
		mutationFn: async () => {
			const saved = post ? await updateBlogPost(post.id, input()) : await createBlogPost(input());
			return publishBlogPost(saved.id);
		},
		onSuccess: (saved) => {
			toast.success("Published");
			setStatus(saved.status);
			invalidate();
			if (!post) router.replace(`/admin/blog/${saved.id}`);
		},
		onError: failed,
	});
	const unpublish = useMutation({
		mutationFn: () => unpublishBlogPost(post!.id),
		onSuccess: (saved) => {
			toast.success("Taken off the public pages");
			setStatus(saved.status);
			invalidate();
		},
		onError: failed,
	});
	const remove = useMutation({
		mutationFn: () => deleteBlogPost(post!.id),
		onSuccess: () => {
			toast.success("Deleted");
			invalidate();
			router.push("/admin/blog");
		},
		onError: failed,
	});

	const busy = save.isPending || publish.isPending || unpublish.isPending || remove.isPending;
	const ready = title.trim() !== "" && bodyHtml.trim() !== "";

	const toggleTopic = (name: string) =>
		setTopics((current) => (current.includes(name) ? current.filter((t) => t !== name) : current.length < MAX_TOPICS ? [...current, name] : current));

	return (
		<div className="mx-auto max-w-4xl space-y-4 p-4 md:p-8">
			<Card>
				<CardContent className="space-y-4 pt-6">
					<div className="space-y-1">
						<Label htmlFor="title">Title</Label>
						<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={300} />
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-1">
							<Label htmlFor="slug">Web address (optional)</Label>
							<Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="lowercase-letters-and-hyphens" maxLength={200} />
							<p className="text-xs text-muted-foreground">Left empty, it is built from the title. Changing it breaks old links to the post.</p>
						</div>
						<div className="space-y-1">
							<Label htmlFor="language">Language</Label>
							<NativeSelect id="language" value={language} onChange={(e) => setLanguage(e.target.value as "bn" | "en")}>
								<option value="bn">Bangla</option>
								<option value="en">English</option>
							</NativeSelect>
						</div>
					</div>
					<div className="space-y-1">
						<Label htmlFor="summary">Summary (shown in lists and search results)</Label>
						<Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={600} rows={3} />
					</div>
					<div className="space-y-1">
						<Label htmlFor="cover">Cover image</Label>
						<Input id="cover" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="blog/file-name.png or a full https link" maxLength={500} />
						<p className="text-xs text-muted-foreground">A file name under blog/ in the public bucket, or a full https link. Uploading from this page comes later.</p>
					</div>
					<div className="space-y-1">
						<Label htmlFor="speciality">Related speciality (adds a Find a doctor button)</Label>
						<NativeSelect id="speciality" value={specialityId} onChange={(e) => setSpecialityId(e.target.value)}>
							<option value="">None</option>
							{(specialities.data ?? []).map((s) => (
								<option key={s.id} value={s.id}>
									{s.name}
								</option>
							))}
						</NativeSelect>
					</div>
					<fieldset className="space-y-2">
						<legend className="text-sm font-medium">Topics (up to {MAX_TOPICS})</legend>
						<div className="flex flex-wrap gap-2">
							{(topicList.data ?? []).map((t) => (
								<button
									key={t.id}
									type="button"
									onClick={() => toggleTopic(t.name)}
									aria-pressed={topics.includes(t.name)}
									className={`rounded-full border px-3 py-1 text-sm ${topics.includes(t.name) ? "bg-primary text-primary-foreground" : "bg-background"}`}
								>
									{t.displayName}
								</button>
							))}
						</div>
					</fieldset>
					<div className="space-y-1">
						<Label>Article</Label>
						<RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
					</div>
				</CardContent>
			</Card>

			<div className="flex flex-wrap items-center gap-2">
				<Button type="button" disabled={!ready || busy} onClick={() => save.mutate()}>
					{post ? "Save changes" : "Save draft"}
				</Button>
				{status !== "PUBLISHED" && (
					<Button type="button" variant="secondary" disabled={!ready || busy} onClick={() => publish.mutate()}>
						{post ? "Save and publish" : "Publish"}
					</Button>
				)}
				{post && status === "PUBLISHED" && (
					<>
						<Button type="button" variant="outline" disabled={busy} onClick={() => unpublish.mutate()}>
							Unpublish
						</Button>
						<Button asChild variant="link">
							<Link href={`/blog/${post.slug}`} target="_blank">
								View on the site
							</Link>
						</Button>
					</>
				)}
				{post && (
					<Button
						type="button"
						variant="destructive"
						className="ml-auto"
						disabled={busy}
						onClick={() => window.confirm("Delete this post for good?") && remove.mutate()}
					>
						Delete
					</Button>
				)}
				{post && <span className="text-sm text-muted-foreground">Status: {status}</span>}
			</div>
		</div>
	);
}
