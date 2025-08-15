"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HospitalPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function HospitalPagination({
	currentPage,
	totalPages,
	onPageChange,
}: HospitalPaginationProps) {
	const getVisiblePages = () => {
		const pages = [];
		const showEllipsis = totalPages > 7;

		if (!showEllipsis) {
			// Show all pages if 7 or fewer
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Show first page
			pages.push(1);

			if (currentPage > 4) {
				pages.push("...");
			}

			// Show pages around current page
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				if (i !== 1 && i !== totalPages) {
					pages.push(i);
				}
			}

			if (currentPage < totalPages - 3) {
				pages.push("...");
			}

			// Show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const visiblePages = getVisiblePages();

	return (
		<div className="flex items-center gap-1">
			{/* Previous Button */}
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="border-gray-300 text-gray-600 hover:bg-gray-50"
			>
				<ChevronLeft className="w-4 h-4 mr-1" />
				Previous
			</Button>

			{/* Page Numbers */}
			<div className="flex gap-1 mx-2">
				{visiblePages.map((page, index) => {
					if (page === "...") {
						return (
							<span
								key={`ellipsis-${index}`}
								className="px-2 py-1 text-gray-500"
							>
								...
							</span>
						);
					}

					const pageNumber = page as number;
					const isActive = pageNumber === currentPage;

					return (
						<Button
							key={pageNumber}
							variant={isActive ? "default" : "outline"}
							size="sm"
							onClick={() => onPageChange(pageNumber)}
							className={
								isActive
									? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
									: "border-gray-300 text-gray-600 hover:bg-gray-50"
							}
						>
							{pageNumber}
						</Button>
					);
				})}
			</div>

			{/* Next Button */}
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="border-gray-300 text-gray-600 hover:bg-gray-50"
			>
				Next
				<ChevronRight className="w-4 h-4 ml-1" />
			</Button>
		</div>
	);
}
