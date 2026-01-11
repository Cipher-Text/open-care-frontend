"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Eye,
  Phone,
  MapPin,
  Building2,
  Truck,
  CheckCircle,
  XCircle,
  User,
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
import { Ambulance } from "@/types/ambulances";
import { usePermissions } from "@/hooks/use-permissions";

// Actions component to use hooks
function ActionsCell({ ambulance }: { ambulance: Ambulance }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canEditAmbulance = hasPermission("update-ambulance");

  const handleEdit = () => {
    router.push(`/admin/ambulances/${ambulance.id}`);
  };

  const handleViewDetails = () => {
    router.push(`/admin/ambulances/${ambulance.id}/view`);
  };

  const handleCallDriver = () => {
    if (ambulance.driverPhone) {
      window.open(`tel:${ambulance.driverPhone}`, "_self");
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
          onClick={() => navigator.clipboard.writeText(ambulance.id.toString())}
        >
          Copy ambulance ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canEditAmbulance && (
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit ambulance
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
        {ambulance.driverPhone && (
          <DropdownMenuItem onClick={handleCallDriver}>
            <Phone className="mr-2 h-4 w-4" />
            Call driver
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Ambulance>[] = [
  {
    accessorKey: "vehicleNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vehicle
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const ambulance = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <Truck className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <div className="font-medium">{ambulance.vehicleNumber}</div>
            <div className="text-sm text-muted-foreground">
              {ambulance.type?.description}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }) => {
      const ambulance = row.original;
      const isAvailable = ambulance.isAvailable;
      const isActive = ambulance.isActive;
      return (
        <div className="flex flex-col space-y-1">
          <Badge
            variant={isAvailable ? "default" : "secondary"}
            className="w-fit"
          >
            {isAvailable ? (
              <CheckCircle className="mr-1 h-3 w-3" />
            ) : (
              <XCircle className="mr-1 h-3 w-3" />
            )}
            {isAvailable ? "Available" : "Busy"}
          </Badge>
          <Badge
            variant={isActive ? "outline" : "destructive"}
            className="w-fit text-xs"
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "driverName",
    header: "Driver",
    cell: ({ row }) => {
      const ambulance = row.original;
      return (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium text-sm">{ambulance.driverName}</div>
            {ambulance.driverPhone && (
              <div className="text-xs text-muted-foreground">
                {ambulance.driverPhone}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "hospital",
    header: "Hospital",
    cell: ({ row }) => {
      const hospital = row.getValue("hospital") as Ambulance["hospital"];
      const ambulance = row.original;
      return hospital ? (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          <div className="max-w-[200px]">
            <div className="font-medium text-sm truncate">{hospital.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {hospital.bnName}
            </div>
            <Badge variant="outline" className="text-xs mt-1">
              {ambulance.isAffiliated ? "Affiliated" : "Independent"}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">Independent</span>
            <Badge variant="outline" className="text-xs ml-2">
              Non-affiliated
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "district",
    header: "Location",
    cell: ({ row }) => {
      const ambulance = row.original;
      return (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <div>{ambulance.district?.name}</div>
            {ambulance.upazila && (
              <div className="text-xs text-muted-foreground">
                {ambulance.upazila.name}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as Ambulance["type"];
      const getTypeColor = (value: string) => {
        switch (value) {
          case "AIR_AMBULANCE":
            return "bg-purple-100 text-purple-800";
          case "ADVANCED":
            return "bg-green-100 text-green-800";
          case "BASIC":
            return "bg-blue-100 text-blue-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <Badge className={getTypeColor(type?.value || "")}>
          {type?.description || "Unknown"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ambulance = row.original;
      return <ActionsCell ambulance={ambulance} />;
    },
  },
];
