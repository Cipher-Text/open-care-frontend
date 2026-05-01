"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Eye,
  Globe,
  MapPin,
  Building2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Association } from "@/types/associations";
import { usePermissions } from "@/hooks/use-permissions";

// Actions component to use hooks
function ActionsCell({ association }: { association: Association }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canEditAssociation = hasPermission("update-master-data");
  const canDeleteAssociation = hasPermission("delete-master-data");

  const handleEdit = () => {
    router.push(`/admin/associations/${association.id}`);
  };

  const handleViewDetails = () => {
    router.push(`/admin/associations/${association.id}/view`);
  };

  const handleDelete = () => {};

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleViewDetails}
        aria-label="View association"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canEditAssociation && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleEdit}
          aria-label="Edit association"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {canDeleteAssociation && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={handleDelete}
          aria-label="Delete association"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
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
