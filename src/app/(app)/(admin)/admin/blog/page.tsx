"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { fetchAdminBlogPosts } from "@/api/blog-admin";
import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE = 20;

export default function AdminBlogPage() {
	const [term, setTerm] = useState("");
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");
	const [page, setPage] = useState(1);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["admin-blog", "list", search, status, page],
		queryFn: () => fetchAdminBlogPosts({ q: search || undefined, status: status || undefined, page, size: PAGE_SIZE }),
		placeholderData: (previous) => previous,
	});

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		setPage(1);
		setSearch(term.trim());
	};

	return (
		<div className="flex flex-col">
			<AdminHeader title="Blog" description="Write, publish and take down health articles">
				<Button asChild>
					<Link href="/admin/blog/new">
						<Plus className="mr-1 h-4 w-4" /> New article
					</Link>
				</Button>
			</AdminHeader>
			<div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
				<form onSubmit={submit} className="flex flex-wrap gap-2">
					<div className="w-full sm:w-44">
						<NativeSelect
							aria-label="Status"
							value={status}
							onChange={(e) => {
								setStatus(e.target.value);
								setPage(1);
							}}
						>
							<option value="">All statuses</option>
							<option value="DRAFT">Draft</option>
							<option value="PUBLISHED">Published</option>
							<option value="UNPUBLISHED">Unpublished</option>
						</NativeSelect>
					</div>
					<div className="relative min-w-56 flex-1 sm:max-w-sm">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input className="pl-8" placeholder="Search title or summary" value={term} onChange={(e) => setTerm(e.target.value)} />
					</div>
					<Button type="submit">Search</Button>
				</form>
				<Card>
					<CardContent className="pt-6">
						{isError ? (
							<p className="text-center text-destructive">Error loading articles: {(error as Error).message}</p>
						) : isLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Published</TableHead>
										<TableHead>Topics</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(data?.content ?? []).map((post) => (
										<TableRow key={post.id}>
											<TableCell className="max-w-md font-medium">
												<Link href={`/admin/blog/${post.id}`} className="hover:underline">
													{post.title}
												</Link>
											</TableCell>
											<TableCell>
												<Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>{post.status}</Badge>
											</TableCell>
											<TableCell>{post.publishedAt ? post.publishedAt.slice(0, 10) : "-"}</TableCell>
											<TableCell className="text-muted-foreground">{post.topics.map((t) => t.displayName).join(", ")}</TableCell>
										</TableRow>
									))}
									{(data?.content ?? []).length === 0 && (
										<TableRow>
											<TableCell colSpan={4} className="text-center text-muted-foreground">
												No articles found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
						{data && data.totalPages > 1 && (
							<div className="flex items-center justify-end gap-3 pt-4 text-sm">
								<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
									Previous
								</Button>
								<span>
									Page {data.currentPage} of {data.totalPages}
								</span>
								<Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>
									Next
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
