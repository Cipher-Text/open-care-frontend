"use client";

import { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	totalItems?: number;
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
}

export function DataTablePagination<TData>({
	table,
	totalItems,
	currentPage,
	totalPages,
	onPageChange,
}: DataTablePaginationProps<TData>) {
	const handlePageChange = (page: number) => {
		if (onPageChange) {
			onPageChange(page);
		} else {
			table.setPageIndex(page - 1);
		}
	};

	const handlePreviousPage = () => {
		const current = currentPage || table.getState().pagination.pageIndex + 1;
		if (current > 1) {
			handlePageChange(current - 1);
		}
	};

	const handleNextPage = () => {
		const current = currentPage || table.getState().pagination.pageIndex + 1;
		const total = totalPages || table.getPageCount();
		if (current < total) {
			handlePageChange(current + 1);
		}
	};

	const handleFirstPage = () => {
		handlePageChange(1);
	};

	const handleLastPage = () => {
		const total = totalPages || table.getPageCount();
		handlePageChange(total);
	};

	const generatePageNumbers = () => {
		const current = currentPage || table.getState().pagination.pageIndex + 1;
		const total = totalPages || table.getPageCount();
		const pages: (number | string)[] = [];

		if (total <= 7) {
			// Show all pages if 7 or fewer
			for (let i = 1; i <= total; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (current > 4) {
				pages.push("...");
			}

			// Show pages around current page
			const start = Math.max(2, current - 1);
			const end = Math.min(total - 1, current + 1);

			for (let i = start; i <= end; i++) {
				if (!pages.includes(i)) {
					pages.push(i);
				}
			}

			if (current < total - 3) {
				pages.push("...");
			}

			// Always show last page
			if (!pages.includes(total)) {
				pages.push(total);
			}
		}

		return pages;
	};

	return (
		<div className="flex items-center justify-between px-2 pt-4">
			<div className="flex-1 text-sm text-muted-foreground">
				{totalItems !== undefined ? (
					<>
						Showing{" "}
						{((currentPage || 1) - 1) * table.getState().pagination.pageSize +
							1}{" "}
						to{" "}
						{Math.min(
							(currentPage || 1) * table.getState().pagination.pageSize,
							totalItems
						)}{" "}
						of {totalItems} entries
					</>
				) : (
					<>
						Showing{" "}
						{table.getState().pagination.pageIndex *
							table.getState().pagination.pageSize +
							1}{" "}
						to{" "}
						{Math.min(
							(table.getState().pagination.pageIndex + 1) *
								table.getState().pagination.pageSize,
							table.getFilteredRowModel().rows.length
						)}{" "}
						of {table.getFilteredRowModel().rows.length} entries
						{table.getRowModel().rows.length !==
							table.getCoreRowModel().rows.length && (
							<span>
								{" "}
								(filtered from {table.getCoreRowModel().rows.length} total
								entries)
							</span>
						)}
					</>
				)}
			</div>

			{/* Navigation with page numbers */}
			<div className="flex items-center space-x-2">
				<Button
					variant="outline"
					className="hidden h-8 w-8 p-0 lg:flex"
					onClick={handleFirstPage}
					disabled={
						currentPage === 1 || (!currentPage && !table.getCanPreviousPage())
					}
				>
					<span className="sr-only">Go to first page</span>
					<ChevronsLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					className="h-8 w-8 p-0"
					onClick={handlePreviousPage}
					disabled={
						currentPage === 1 || (!currentPage && !table.getCanPreviousPage())
					}
				>
					<span className="sr-only">Go to previous page</span>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				{/* Page numbers */}
				<div className="flex items-center space-x-1">
					{generatePageNumbers().map((page, index) => (
						<div key={index}>
							{page === "..." ? (
								<Button variant="ghost" className="h-8 w-8 p-0" disabled>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							) : (
								<Button
									variant={
										(currentPage ||
											table.getState().pagination.pageIndex + 1) === page
											? "default"
											: "outline"
									}
									className="h-8 w-8 p-0"
									onClick={() => handlePageChange(page as number)}
								>
									{page}
								</Button>
							)}
						</div>
					))}
				</div>

				<Button
					variant="outline"
					className="h-8 w-8 p-0"
					onClick={handleNextPage}
					disabled={
						currentPage === totalPages ||
						(!currentPage && !table.getCanNextPage())
					}
				>
					<span className="sr-only">Go to next page</span>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					className="hidden h-8 w-8 p-0 lg:flex"
					onClick={handleLastPage}
					disabled={
						currentPage === totalPages ||
						(!currentPage && !table.getCanNextPage())
					}
				>
					<span className="sr-only">Go to last page</span>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
