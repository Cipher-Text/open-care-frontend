"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Phone,
  Mail,
  MapPin,
  Heart,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/profile";
import { usePermissions } from "@/hooks/use-permissions";

// Actions component to use hooks
function ActionsCell({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canEditProfile = hasPermission("update-profile");
  const canDeleteProfile = hasPermission("delete-profile");

  const handleViewProfile = () => {
    router.push(`/admin/profiles/${profile.id}`);
  };

  const handleEditProfile = () => {
    router.push(`/admin/profiles/${profile.id}`);
  };

  const handleDelete = () => {};

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleViewProfile}
        aria-label="View profile"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canEditProfile && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleEditProfile}
          aria-label="Edit profile"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {canDeleteProfile && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={handleDelete}
          aria-label="Delete profile"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

const getInitials = (name: string | null) => {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profile
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profile.photoUrl || undefined}
              alt={profile.name}
            />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{profile.name}</div>
            <div className="text-sm text-muted-foreground">
              {profile.bnName}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "userType.displayName",
    header: "User Type",
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <div>
          <Badge variant="outline" className="text-xs">
            {profile.userType.displayName}
          </Badge>
          <div className="text-xs text-muted-foreground mt-1">
            {profile.userType.banglaName}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <div className="space-y-1">
          {profile.phone && (
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="truncate max-w-[200px]">{profile.email}</span>
            </div>
          )}
          {!profile.phone && !profile.email && (
            <span className="text-muted-foreground text-sm">No contact</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "gender.displayName",
    header: "Gender",
    cell: ({ row }) => {
      const profile = row.original;
      return profile.gender ? (
        <div>
          <div className="text-sm">{profile.gender.displayName}</div>
          <div className="text-xs text-muted-foreground">
            {profile.gender.banglaName}
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">N/A</span>
      );
    },
  },
  {
    accessorKey: "district.name",
    header: "Location",
    cell: ({ row }) => {
      const profile = row.original;
      return profile.district ? (
        <div className="flex items-start gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground mt-1" />
          <div>
            <div className="text-sm">{profile.district.name}</div>
            {profile.upazila && (
              <div className="text-xs text-muted-foreground">
                {profile.upazila.name}
              </div>
            )}
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">N/A</span>
      );
    },
  },
  {
    accessorKey: "bloodGroup.displayName",
    header: "Blood Group",
    cell: ({ row }) => {
      const profile = row.original;
      return profile.bloodGroup ? (
        <div className="text-center">
          <Badge
            variant={profile.isBloodDonor ? "default" : "secondary"}
            className="text-xs"
          >
            {profile.bloodGroup.displayName}
          </Badge>
          {profile.isBloodDonor && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span className="text-xs text-muted-foreground">Donor</span>
            </div>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">N/A</span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <div className="space-y-1">
          <Badge variant={profile.isActive ? "default" : "secondary"}>
            {profile.isActive ? "Active" : "Inactive"}
          </Badge>
          {profile.isVolunteer && (
            <div>
              <Badge variant="outline" className="text-xs">
                Volunteer
              </Badge>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const profile = row.original;
      return <ActionsCell profile={profile} />;
    },
  },
];
