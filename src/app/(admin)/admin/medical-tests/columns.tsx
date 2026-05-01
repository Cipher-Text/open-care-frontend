"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MedicalTest } from "@/types/medical-tests";
import { usePermissions } from "@/hooks/use-permissions";

function ActionsCell({ medicalTest: _medicalTest }: { medicalTest: MedicalTest }) {
  const { hasPermission } = usePermissions();
  const canEditMedicalTest = hasPermission("update-master-data");
  const canDeleteMedicalTest = hasPermission("delete-master-data");

  const handleViewDetails = () => {};

  const handleEdit = () => {};

  const handleDelete = () => {};

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleViewDetails}
        aria-label="View medical test"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canEditMedicalTest && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleEdit}
          aria-label="Edit medical test"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {canDeleteMedicalTest && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={handleDelete}
          aria-label="Delete medical test"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export const columns: ColumnDef<MedicalTest>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <span className="font-mono text-sm">{id}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Name (English)",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const parentId = row.original.parentId;

      return (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{name}</span>
          {parentId && (
            <Badge variant="secondary" className="text-xs">
              Sub-test
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "bnName",
    header: "নাম (বাংলা)",
    cell: ({ row }) => {
      const bnName = row.getValue("bnName") as string;
      return <span className="font-medium text-right">{bnName}</span>;
    },
  },
  {
    accessorKey: "alternativeNames",
    header: "Alternative Names",
    cell: ({ row }) => {
      const alternativeNames = row.getValue("alternativeNames") as
        | string
        | null;
      return alternativeNames ? (
        <span className="text-sm text-muted-foreground">
          {alternativeNames}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "hospitalCount",
    header: "Available In",
    cell: ({ row }) => {
      const hospitalCount = row.getValue("hospitalCount") as number | null;
      return hospitalCount ? (
        <Badge variant="outline">
          {hospitalCount} hospital{hospitalCount !== 1 ? "s" : ""}
        </Badge>
      ) : (
        <span className="text-sm text-muted-foreground">Not available</span>
      );
    },
  },
  {
    accessorKey: "parentId",
    header: "Type",
    cell: ({ row }) => {
      const parentId = row.getValue("parentId") as number | null;
      return parentId ? (
        <Badge variant="secondary">Sub-test</Badge>
      ) : (
        <Badge variant="default">Main test</Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return description ? (
        <span className="text-sm text-muted-foreground max-w-xs truncate">
          {description}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const medicalTest = row.original;
      return <ActionsCell medicalTest={medicalTest} />;
    },
  },
];
