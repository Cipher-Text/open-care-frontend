"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Edit, Eye, Users } from "lucide-react";
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
import { MedicalSpeciality } from "@/types/medical-specialities";
import { usePermissions } from "@/hooks/use-permissions";

// Actions component to use hooks
function ActionsCell({ speciality }: { speciality: MedicalSpeciality }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canEditSpeciality = hasPermission("update-master-data");

  const handleEdit = () => {
    router.push(`/admin/medical-specialities/${speciality.id}`);
  };

  const handleViewDoctors = () => {
    router.push(`/admin/doctors?speciality=${speciality.id}`);
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
            navigator.clipboard.writeText(speciality.id.toString())
          }
        >
          Copy speciality ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canEditSpeciality && (
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit speciality
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleViewDoctors}>
          <Users className="mr-2 h-4 w-4" />
          View doctors
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const speciality = row.original;
      return <ActionsCell speciality={speciality} />;
    },
  },
];
