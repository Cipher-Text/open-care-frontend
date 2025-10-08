"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Copy,
  Edit,
  Eye,
  Globe,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  SocialOrganization,
  SocialOrganizationType,
  OriginCountry,
} from "@/types/social-organizations";

const getOrganizationTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "NGO":
      return "default";
    case "RI":
      return "secondary";
    case "GO":
      return "outline";
    default:
      return "secondary";
  }
};

export const columns: ColumnDef<SocialOrganization>[] = [
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
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const bnName = row.original.bnName;
      const websiteUrl = row.original.websiteUrl;

      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{name}</span>
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="text-sm text-muted-foreground text-right">
            {bnName}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "socialOrganizationType",
    header: "Type",
    cell: ({ row }) => {
      const orgType = row.getValue(
        "socialOrganizationType"
      ) as SocialOrganizationType;
      return (
        <div className="space-y-1">
          <Badge variant={getOrganizationTypeBadgeVariant(orgType.value)}>
            {orgType.value}
          </Badge>
          <div className="text-xs text-muted-foreground max-w-32 truncate">
            {orgType.displayName}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "originCountry",
    header: "Country",
    cell: ({ row }) => {
      const country = row.getValue("originCountry") as OriginCountry;
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="text-xs">
              {country.acronym}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {country.displayNameEn}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const email = row.original.email;
      const phone = row.original.phone;

      return (
        <div className="space-y-1">
          {email && (
            <div className="flex items-center space-x-1 text-xs">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-32">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center space-x-1 text-xs">
              <Phone className="h-3 w-3" />
              <span className="truncate max-w-32">{phone}</span>
            </div>
          )}
          {!email && !phone && (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "socialMedia",
    header: "Social Media",
    cell: ({ row }) => {
      const { facebookUrl, twitterUrl, linkedinUrl, youtubeUrl } = row.original;
      const socialLinks = [
        facebookUrl,
        twitterUrl,
        linkedinUrl,
        youtubeUrl,
      ].filter(Boolean);

      return socialLinks.length > 0 ? (
        <div className="flex space-x-1">
          {socialLinks.slice(0, 3).map((url, index) => (
            <a
              key={index}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <Globe className="h-3 w-3" />
            </a>
          ))}
          {socialLinks.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{socialLinks.length - 3}
            </span>
          )}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return description ? (
        <span className="text-sm text-muted-foreground max-w-xs truncate block">
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
      const organization = row.original;

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
                navigator.clipboard.writeText(organization.id.toString())
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit organization
            </DropdownMenuItem>
            {organization.websiteUrl && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href={organization.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Visit website
                  </a>
                </DropdownMenuItem>
              </>
            )}
            {organization.email && (
              <DropdownMenuItem asChild>
                <a href={`mailto:${organization.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send email
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
