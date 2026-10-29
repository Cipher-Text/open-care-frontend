"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminBlogPost } from "@/api/blog-admin";
import { AdminHeader } from "@/components/admin/admin-header";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const { data, isLoading, isError, error } = useQuery({ queryKey: ["admin-blog", "post", id], queryFn: () => fetchAdminBlogPost(id) });

	return (
		<div className="flex flex-col">
			<AdminHeader title="Edit article" />
			{isError ? (
				<p className="p-8 text-center text-destructive">Could not load the article: {(error as Error).message}</p>
			) : isLoading || !data ? (
				<Skeleton className="m-8 h-96" />
			) : (
				// The key remounts the form with the saved values after a reload of the same post
				<BlogPostForm key={`${data.id}-${data.slug}`} post={data} />
			)}
		</div>
	);
}
