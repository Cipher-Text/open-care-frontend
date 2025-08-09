"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	MoreHorizontal,
	MapPin,
	Edit,
	Building2,
	Bed,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hospital } from "@/types/hospitals";

// Actions component to use hooks
function ActionsCell({ hospital }: { hospital: Hospital }) {
	const router = useRouter();

	const handleEdit = () => {
		router.push(`/admin/hospitals/${hospital.id}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() => navigator.clipboard.writeText(hospital.id.toString())}
				>
					Copy hospital ID
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleEdit}>
					<Edit className="mr-2 h-4 w-4" />
					Edit hospital
				</DropdownMenuItem>
				<DropdownMenuItem>View details</DropdownMenuItem>
				<DropdownMenuItem>View departments</DropdownMenuItem>
				<DropdownMenuItem>View doctors</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const columns: ColumnDef<Hospital>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Hospital
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const hospital = row.original;
			return (
				<div className="flex items-center space-x-3">
					<div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
						<Building2 className="h-5 w-5 text-blue-600" />
					</div>
					<div>
						<div className="font-medium">{hospital.name}</div>
						<div className="text-sm text-muted-foreground">
							{hospital.bnName}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "numberOfBed",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					<Bed className="mr-2 h-4 w-4" />
					Beds
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const beds = row.getValue("numberOfBed") as number;
			return <span className="text-sm font-medium">{beds}</span>;
		},
	},
	{
		accessorKey: "hospitalType",
		header: "Type",
		cell: ({ row }) => {
			const hospitalType = row.original.hospitalType;

			// Handle if hospitalType is an object with englishName/banglaName or a string
			let displayText = "Unknown";

			if (typeof hospitalType === "string") {
				displayText = hospitalType;
			} else if (hospitalType && typeof hospitalType === "object") {
				const typeObj = hospitalType as {
					englishName?: string;
					banglaName?: string;
				};
				displayText = typeObj.englishName || typeObj.banglaName || "Unknown";
			}

			return (
				<Badge variant="outline" className="capitalize">
					{displayText}
				</Badge>
			);
		},
	},
	{
		accessorKey: "organizationType",
		header: "Organization",
		cell: ({ row }) => {
			const orgType = row.original.organizationType;
			const getVariant = (type: string | null | undefined) => {
				if (!type) return "outline";
				switch (type) {
					case "GOVERNMENT":
						return "default";
					case "PRIVATE":
						return "secondary";
					default:
						return "outline";
				}
			};

			// Handle if orgType is an object with englishName/banglaName or a string
			let displayText = "Unknown";
			let variantType = "";

			if (typeof orgType === "string") {
				displayText = orgType;
				variantType = orgType;
			} else if (orgType && typeof orgType === "object") {
				const orgObj = orgType as { englishName?: string; banglaName?: string };
				displayText = orgObj.englishName || orgObj.banglaName || "Unknown";
				variantType = orgObj.englishName || orgObj.banglaName || "";
			}

			return (
				<Badge variant={getVariant(variantType)} className="capitalize">
					{displayText}
				</Badge>
			);
		},
	},
	{
		accessorKey: "district.name",
		header: "Location",
		cell: ({ row }) => {
			const hospital = row.original;
			return (
				<div className="flex flex-col text-sm">
					<div className="flex items-center text-muted-foreground">
						<MapPin className="h-3 w-3 mr-1" />
						<span>{hospital.district?.name || "District not set"}</span>
					</div>
					<div className="text-xs text-muted-foreground ml-4">
						{hospital.upazila?.name || "Upazila not set"}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "websiteUrl",
		header: "Website",
		cell: ({ row }) => {
			const url = row.getValue("websiteUrl") as string;
			return url ? (
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline text-sm"
				>
					Visit Website
				</a>
			) : (
				<span className="text-muted-foreground text-sm">No website</span>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const hospital = row.original;
			return <ActionsCell hospital={hospital} />;
		},
	},
];
