"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export default function NewBlogPostPage() {
	return (
		<div className="flex flex-col">
			<AdminHeader title="New article" description="Saved as a draft until you publish it" />
			<BlogPostForm />
		</div>
	);
}
