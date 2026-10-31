"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MedicalSpeciality } from "@/types/medical-specialities";

export const columns: ColumnDef<MedicalSpeciality>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Speciality
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const speciality = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-lg">
            {speciality.icon}
          </div>
          <div>
            <div className="font-medium">{speciality.name}</div>
            <div className="text-sm text-muted-foreground">
              {speciality.bnName}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "doctorCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Users className="mr-2 h-4 w-4" />
          Doctors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const doctorCount = row.getValue("doctorCount") as number | null;
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="font-medium">
            {doctorCount || 0}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "parentId",
    header: "Type",
    cell: ({ row }) => {
      const parentId = row.getValue("parentId") as number | null;
      return (
        <Badge variant={parentId ? "outline" : "default"}>
          {parentId ? "Sub-speciality" : "Main Speciality"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return (
        <div className="max-w-[200px] truncate">
          {description || "No description available"}
        </div>
      );
    },
  },
];
