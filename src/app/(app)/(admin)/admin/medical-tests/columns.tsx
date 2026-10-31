"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MedicalTest } from "@/types/medical-tests";

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
];
