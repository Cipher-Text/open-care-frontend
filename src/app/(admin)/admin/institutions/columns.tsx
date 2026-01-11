"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Building,
  MapPin,
  Globe,
  Calendar,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InstitutionResponse } from "@/types/institutions";
import { usePermissions } from "@/hooks/use-permissions";

// Actions component to use hooks
function ActionsCell({ institution }: { institution: InstitutionResponse }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canEditInstitution = hasPermission("update-institution");
  const canDeleteInstitution = hasPermission("delete-institution");

  const handleEdit = () => {
    router.push(`/admin/institutions/${institution.id}`);
  };

  const handleViewDetails = () => {
    router.push(`/admin/institutions/${institution.id}/view`);
  };

  const handleDelete = () => {};

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleViewDetails}
        aria-label="View institution"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canEditInstitution && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleEdit}
          aria-label="Edit institution"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {canDeleteInstitution && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={handleDelete}
          aria-label="Delete institution"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export const columns: ColumnDef<InstitutionResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Institution
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const institution = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {institution.imageUrl ? (
              <Image
                src={institution.imageUrl}
                alt={institution.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <Building className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div>
            <div className="font-medium">{institution.name}</div>
            <div className="text-sm text-muted-foreground">
              {institution.bnName}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "acronym",
    header: "Acronym",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-mono">
          {row.getValue("acronym")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "institutionType.englishName",
    header: "Type",
    cell: ({ row }) => {
      const institution = row.original;
      return (
        <div className="text-sm">
          {institution.institutionType?.englishName || "Not specified"}
        </div>
      );
    },
  },
  {
    accessorKey: "establishedYear",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Calendar className="mr-1 h-3 w-3" />
          Established
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const year = row.getValue("establishedYear") as number;
      return <span className="text-sm">{year}</span>;
    },
  },
  {
    accessorKey: "enroll",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Enrollment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const enrollment = row.getValue("enroll") as number;
      return (
        <span className="text-sm">{enrollment?.toLocaleString() || "N/A"}</span>
      );
    },
  },
  {
    accessorKey: "district.name",
    header: "Location",
    cell: ({ row }) => {
      const institution = row.original;
      return (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{institution.district?.name || "Location not set"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "websiteUrl",
    header: "Website",
    cell: ({ row }) => {
      const websiteUrl = row.getValue("websiteUrl") as string;
      return websiteUrl ? (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <Globe className="h-3 w-3 mr-1" />
          Visit
        </a>
      ) : (
        <span className="text-sm text-muted-foreground">No website</span>
      );
    },
  },
  {
    accessorKey: "affiliated",
    header: "Status",
    cell: ({ row }) => {
      const affiliated = row.getValue("affiliated") as boolean;
      return (
        <Badge variant={affiliated ? "default" : "secondary"}>
          {affiliated ? "Affiliated" : "Independent"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const institution = row.original;
      return <ActionsCell institution={institution} />;
    },
  },
];
