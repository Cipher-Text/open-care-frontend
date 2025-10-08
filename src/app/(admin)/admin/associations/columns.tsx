"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Eye,
  Globe,
  MapPin,
  Building2,
  ExternalLink,
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
import { Association } from "@/types/associations";

// Actions component to use hooks
function ActionsCell({ association }: { association: Association }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/associations/${association.id}`);
  };

  const handleViewWebsite = () => {
    if (association.websiteUrl) {
      window.open(association.websiteUrl, "_blank");
    }
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
          onClick={() =>
            navigator.clipboard.writeText(association.id.toString())
          }
        >
          Copy association ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit association
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
        {association.websiteUrl && (
          <DropdownMenuItem onClick={handleViewWebsite}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit website
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Association>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Association
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const association = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{association.name}</div>
            <div className="text-sm text-muted-foreground">
              {association.bnName}
            </div>
            {association.shortName && (
              <div className="text-xs text-muted-foreground">
                ({association.shortName})
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "medicalSpeciality",
    header: "Speciality",
    cell: ({ row }) => {
      const speciality = row.getValue(
        "medicalSpeciality"
      ) as Association["medicalSpeciality"];
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{speciality?.icon}</span>
          <div>
            <div className="font-medium text-sm">{speciality?.name}</div>
            <div className="text-xs text-muted-foreground">
              {speciality?.bnName}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "associationType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue(
        "associationType"
      ) as Association["associationType"];
      return <Badge variant="outline">{type?.bnName || "Not specified"}</Badge>;
    },
  },
  {
    accessorKey: "division",
    header: "Location",
    cell: ({ row }) => {
      const association = row.original;
      return (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            {association.district?.name ||
              association.division?.name ||
              "Not specified"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "websiteUrl",
    header: "Website",
    cell: ({ row }) => {
      const websiteUrl = row.getValue("websiteUrl") as string | null;
      return websiteUrl ? (
        <div className="flex items-center space-x-1">
          <Globe className="h-4 w-4 text-green-600" />
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Visit
          </a>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No website</span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => {
      const association = row.original;
      return (
        <div className="text-sm">
          {association.email && (
            <div className="truncate max-w-[150px]">{association.email}</div>
          )}
          {association.phone && (
            <div className="text-muted-foreground">{association.phone}</div>
          )}
          {!association.email && !association.phone && (
            <span className="text-muted-foreground">No contact info</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const association = row.original;
      return <ActionsCell association={association} />;
    },
  },
];
