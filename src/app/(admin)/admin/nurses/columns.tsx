"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  UserCheck,
  UserX,
  MapPin,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NurseResponse } from "@/types/nurses";
import { usePermissions } from "@/hooks/use-permissions";

// Actions component to use hooks
function ActionsCell({ nurse }: { nurse: NurseResponse }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canEditNurse = hasPermission("update-nurse");
  const canDeleteNurse = hasPermission("delete-nurse");

  const handleEdit = () => {
    router.push(`/admin/nurses/${nurse.id}`);
  };

  const handleViewProfile = () => {
    router.push(`/admin/profiles/${nurse.profile.id}`);
  };

  const handleDelete = () => {};

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleViewProfile}
        aria-label="View nurse"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canEditNurse && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleEdit}
          aria-label="Edit nurse"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {canDeleteNurse && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={handleDelete}
          aria-label="Delete nurse"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export const columns: ColumnDef<NurseResponse>[] = [
  {
    accessorKey: "profile.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nurse
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const nurse = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {nurse.profile.imageUrl || nurse.profile.photo ? (
              <Image
                src={nurse.profile.imageUrl || nurse.profile.photo || ""}
                alt={nurse.profile.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {nurse.profile.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">{nurse.profile.name}</div>
            <div className="text-sm text-muted-foreground">
              {nurse.profile.email || "No email"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "bnmcNo",
    header: "BNMC No.",
    cell: ({ row }) => {
      return (
        <span className="font-mono text-sm">{row.getValue("bnmcNo")}</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[200px]">
          <span className="text-sm">{description || "Not specified"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "yearOfExperience",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Experience
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const experience = row.getValue("yearOfExperience") as number;
      return <span className="text-sm">{experience} years</span>;
    },
  },
  {
    accessorKey: "profile.district.name",
    header: "Location",
    cell: ({ row }) => {
      const nurse = row.original;
      return (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{nurse.profile.district?.name || "Location not set"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? (
            <>
              <UserCheck className="h-3 w-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <UserX className="h-3 w-3 mr-1" />
              Inactive
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verification",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified") as boolean;
      return (
        <Badge variant={isVerified ? "default" : "destructive"}>
          {isVerified ? "Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const nurse = row.original;
      return <ActionsCell nurse={nurse} />;
    },
  },
];
