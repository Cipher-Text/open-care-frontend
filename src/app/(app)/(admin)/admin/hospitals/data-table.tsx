"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Search, Filter } from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/ui/data-table-pagination-advanced";
import { Upazila, Union } from "@/types/locations";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	totalItems?: number;
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	onFilterChange?: (filters: {
		search?: string;
		upazilaId?: string;
		unionId?: string;
	}) => void;
	upazilas?: Upazila[];
	unions?: Union[];
	isUpazilasLoading?: boolean;
	isUnionsLoading?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	totalItems,
	currentPage,
	totalPages,
	onPageChange,
	onFilterChange,
	upazilas = [],
	unions = [],
	isUpazilasLoading,
	isUnionsLoading,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [searchValue, setSearchValue] = React.useState("");
	const [selectedUpazilaId, setSelectedUpazilaId] =
		React.useState<string>("all");
	const [selectedUnionId, setSelectedUnionId] = React.useState<string>("all");

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	// Debounced filter handler
	React.useEffect(() => {
		const timer = setTimeout(() => {
			onFilterChange?.({
				search: searchValue,
				upazilaId: selectedUpazilaId === "all" ? "" : selectedUpazilaId,
				unionId: selectedUnionId === "all" ? "" : selectedUnionId,
			});
		}, 500);

		return () => clearTimeout(timer);
	}, [searchValue, selectedUpazilaId, selectedUnionId, onFilterChange]);

	const handleUpazilaChange = (value: string) => {
		setSelectedUpazilaId(value);
		// Reset union selection when upazila changes
		if (selectedUnionId !== "all") {
			setSelectedUnionId("all");
		}
	};

	const handleClearFilters = () => {
		setSearchValue("");
		setSelectedUpazilaId("all");
		setSelectedUnionId("all");
		onFilterChange?.({ search: "", upazilaId: "", unionId: "" });
	};

	// Filter unions based on selected upazila
	const filteredUnions = React.useMemo(() => {
		if (selectedUpazilaId === "all" || !selectedUpazilaId) return [];
		return unions.filter(
			(union) => union.upazila.id.toString() === selectedUpazilaId
		);
	}, [unions, selectedUpazilaId]);

	return (
		<div className="w-full">
			<div className="flex items-center justify-between py-4">
				<div className="flex items-center space-x-2 flex-1">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Filter hospitals..."
							value={searchValue}
							onChange={(event) => setSearchValue(event.target.value)}
							className="pl-8"
						/>
					</div>

					<Select value={selectedUpazilaId} onValueChange={handleUpazilaChange}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Select Upazila" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Upazilas</SelectItem>
							{isUpazilasLoading ? (
								<SelectItem value="loading" disabled>
									Loading...
								</SelectItem>
							) : (
								upazilas.map((upazila) => (
									<SelectItem key={upazila.id} value={upazila.id.toString()}>
										{upazila.name}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>

					<Select
						value={selectedUnionId}
						onValueChange={setSelectedUnionId}
						disabled={selectedUpazilaId === "all"}
					>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Select Union" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Unions</SelectItem>
							{isUnionsLoading ? (
								<SelectItem value="loading" disabled>
									Loading...
								</SelectItem>
							) : (
								filteredUnions.map((union) => (
									<SelectItem key={union.id} value={union.id.toString()}>
										{union.name}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>

					{(searchValue || selectedUpazilaId || selectedUnionId) && (
						<Button variant="outline" size="sm" onClick={handleClearFilters}>
							<Filter className="h-4 w-4 mr-1" />
							Clear
						</Button>
					)}
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value: boolean) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination
				table={table}
				totalItems={totalItems}
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	);
}
