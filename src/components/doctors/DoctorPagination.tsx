"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface DoctorPaginationProps {
	currentPage: number;
	totalPages: number;
	totalResults: number;
	resultsPerPage: number;
	onPageChange: (page: number) => void;
}

export default function DoctorPagination({
	currentPage,
	totalPages,
	totalResults,
	resultsPerPage,
	onPageChange,
}: DoctorPaginationProps) {
	const startResult = (currentPage - 1) * resultsPerPage + 1;
	const endResult = Math.min(currentPage * resultsPerPage, totalResults);

	const generatePageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total pages is small
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			const startPage = Math.max(2, currentPage - 1);
			const endPage = Math.min(totalPages - 1, currentPage + 1);

			// Add ellipsis after first page if needed
			if (startPage > 2) {
				pages.push("...");
			}

			// Add middle pages
			for (let i = startPage; i <= endPage; i++) {
				if (i !== 1 && i !== totalPages) {
					pages.push(i);
				}
			}

			// Add ellipsis before last page if needed
			if (endPage < totalPages - 1) {
				pages.push("...");
			}

			// Always show last page if more than 1 page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	return (
		<div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
			<div className="flex items-center justify-between">
				{/* Results Info */}
				<div className="text-sm text-gray-600">
					Showing {startResult}-{endResult} of {totalResults.toLocaleString()}{" "}
					doctors
				</div>

				{/* Pagination Controls */}
				<div className="flex items-center space-x-2">
					{/* Previous Button */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="h-8 px-3"
					>
						<ChevronLeft className="h-4 w-4 mr-1" />
						Previous
					</Button>

					{/* Page Numbers */}
					<div className="flex items-center space-x-1">
						{generatePageNumbers().map((page, index) => (
							<div key={index}>
								{page === "..." ? (
									<Button variant="ghost" className="h-8 w-8 p-0" disabled>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								) : (
									<Button
										variant={page === currentPage ? "default" : "outline"}
										className={`h-8 w-8 p-0 ${
											page === currentPage
												? "bg-teal-600 text-white hover:bg-teal-700"
												: ""
										}`}
										onClick={() => onPageChange(page as number)}
									>
										{page}
									</Button>
								)}
							</div>
						))}
					</div>

					{/* Next Button */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="h-8 px-3"
					>
						Next
						<ChevronRight className="h-4 w-4 ml-1" />
					</Button>
				</div>
			</div>
		</div>
	);
}
