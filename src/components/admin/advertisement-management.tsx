"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  MousePointerClick,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  deleteAdvertisement,
  deleteAdvertisementType,
  getAdvertisementTypes,
  getAdvertisements,
} from "@/api/advertisements";
import { AdvertisementDialog } from "@/components/admin/advertisements/advertisement-dialog";
import { AdvertisementTypeDialog } from "@/components/admin/advertisements/advertisement-type-dialog";
import { ConfirmDeleteDialog } from "@/components/admin/advertisements/confirm-delete-dialog";
import { usePermissions } from "@/hooks/use-permissions";
import { AdvertisementType, Advertisement } from "@/types/advertisements";
import "./advertisement-management.css";
import { AdminHeader } from "@/components/admin/admin-header";

type TabType = "types" | "advertisements";

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { id: "types", label: "Advertisement Types", icon: "📋" },
  { id: "advertisements", label: "Advertisements", icon: "📢" },
];

const AdvertisementManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("types");
  const [types, setTypes] = useState<AdvertisementType[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Create / edit / delete (each action needs its own permission)
  const { hasPermission } = usePermissions();
  const canCreateType = hasPermission("create-advertisement-type");
  const canUpdateType = hasPermission("update-advertisement-type");
  const canDeleteType = hasPermission("delete-advertisement-type");
  const canCreateAd = hasPermission("create-advertisement");
  const canUpdateAd = hasPermission("update-advertisement");
  const canDeleteAd = hasPermission("delete-advertisement");

  const [typeDialog, setTypeDialog] = useState<{ open: boolean; type: AdvertisementType | null }>({
    open: false,
    type: null,
  });
  const [adDialog, setAdDialog] = useState<{ open: boolean; ad: Advertisement | null }>({
    open: false,
    ad: null,
  });
  const [deleting, setDeleting] = useState<
    { kind: "type" | "ad"; id: number; label: string } | null
  >(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Pagination state
  const [typesPage, setTypesPage] = useState(0);
  const [typesTotalPages, setTypesTotalPages] = useState(0);
  const [typesTotalItems, setTypesTotalItems] = useState(0);

  const [adsPage, setAdsPage] = useState(0);
  const [adsTotalPages, setAdsTotalPages] = useState(0);
  const [adsTotalItems, setAdsTotalItems] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    if (activeTab === "types") {
      fetchTypes(typesPage);
    } else {
      fetchAdvertisements(adsPage);
    }
  }, [activeTab, typesPage, adsPage]);

  const fetchTypes = async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdvertisementTypes(page, pageSize);
      setTypes(response.content ?? []);
      setTypesTotalPages(response.totalPages);
      setTypesTotalItems(response.totalItems);
    } catch (err) {
      setError("Failed to load advertisement types");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdvertisements(page, pageSize);
      setAdvertisements(response.content ?? []);
      setAdsTotalPages(response.totalPages);
      setAdsTotalItems(response.totalItems);
    } catch (err) {
      setError("Failed to load advertisements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "types") {
      fetchTypes(typesPage);
    } else {
      fetchAdvertisements(adsPage);
    }
  };

  const handlePageChange = (page: number) => {
    if (activeTab === "types") {
      setTypesPage(page);
    } else {
      setAdsPage(page);
    }
  };

  const filteredTypes = types.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type.position?.position ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdvertisements = advertisements.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ad.content ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ad.advertisementType?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletePending(true);
    setDeleteError(null);
    try {
      if (deleting.kind === "type") await deleteAdvertisementType(deleting.id);
      else await deleteAdvertisement(deleting.id);
      toast.success(`${deleting.kind === "type" ? "Advertisement type" : "Advertisement"} deleted`);
      setDeleting(null);
      // Deleting the last row of a page would leave an empty page behind
      const rowsOnPage = deleting.kind === "type" ? types.length : advertisements.length;
      const page = deleting.kind === "type" ? typesPage : adsPage;
      if (rowsOnPage === 1 && page > 0) {
        if (deleting.kind === "type") setTypesPage(page - 1);
        else setAdsPage(page - 1);
      } else {
        handleRefresh();
      }
    } catch (err) {
      setDeleteError((err as Error).message);
    } finally {
      setDeletePending(false);
    }
  };

  const actionCell = (
    canEdit: boolean,
    canRemove: boolean,
    onEdit: () => void,
    onDelete: () => void,
    name: string
  ) => (
    <td>
      <div className="flex gap-1">
        {canEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Edit ${name}`}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Delete ${name}`}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </td>
  );

  const renderTypesTable = () => (
    <div className="advertisement-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Position</th>
            <th>Base Price</th>
            <th>Duration</th>
            {(canUpdateType || canDeleteType) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTypes.map((type) => (
            <tr key={type.id}>
              <td>{type.id}</td>
              <td className="font-medium">{type.name}</td>
              <td className="max-w-xs">{type.description}</td>
              <td>
                <span className="position-badge">{type.position?.position}</span>
              </td>
              <td className="font-semibold">
                ৳{type.basePrice.toLocaleString()}
              </td>
              <td>{type.durationInDays} days</td>
              {(canUpdateType || canDeleteType) &&
                actionCell(
                  canUpdateType,
                  canDeleteType,
                  () => setTypeDialog({ open: true, type }),
                  () => {
                    setDeleteError(null);
                    setDeleting({ kind: "type", id: type.id, label: type.name });
                  },
                  type.name
                )}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredTypes.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No advertisement types found
        </div>
      )}
    </div>
  );

  const renderAdvertisementsTable = () => (
    <div className="advertisement-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Type</th>
            <th>Target</th>
            <th>Location</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Stats</th>
            {(canUpdateAd || canDeleteAd) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredAdvertisements.map((ad) => (
            <tr key={ad.id}>
              <td>{ad.id}</td>
              <td>
                {ad.imageUrl ? (
                  <div className="relative w-[60px] h-[60px]">
                    <Image
                      src={ad.imageUrl}
                      alt={ad.title}
                      fill
                      className="advertisement-image object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.png";
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </td>
              <td>
                <div className="font-medium">{ad.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{ad.content ?? ""}</div>
              </td>
              <td>
                <div className="text-sm">{ad.advertisementType?.name}</div>
                <span className="position-badge mt-1">
                  {ad.advertisementType?.position?.position}
                </span>
              </td>
              <td>
                {ad.targetUrl ? (
                  <a
                    href={ad.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="advertisement-link"
                  >
                    {ad.targetType} {ad.targetId != null ? `#${ad.targetId}` : ""}
                  </a>
                ) : (
                  <span>
                    {ad.targetType} {ad.targetId != null ? `#${ad.targetId}` : ""}
                  </span>
                )}
              </td>
              <td>
                <div className="text-sm">
                  <div>{ad.district?.name ?? "All districts"}</div>
                  {ad.upazila && (
                    <div className="text-xs text-muted-foreground">
                      {ad.upazila.name}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="text-xs">
                  <div>From: {new Date(ad.startTime).toLocaleDateString()}</div>
                  <div>To: {new Date(ad.endTime).toLocaleDateString()}</div>
                </div>
              </td>
              <td>
                <Badge
                  className={ad.isActive ? "badge-active" : "badge-inactive"}
                >
                  {ad.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td>
                <div className="advertisement-stats">
                  <div className="stat-item">
                    <span className="stat-label">Views</span>
                    <span className="stat-value flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {ad.views}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Clicks</span>
                    <span className="stat-value flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" />
                      {ad.clicks}
                    </span>
                  </div>
                </div>
              </td>
              {(canUpdateAd || canDeleteAd) &&
                actionCell(
                  canUpdateAd,
                  canDeleteAd,
                  () => setAdDialog({ open: true, ad }),
                  () => {
                    setDeleteError(null);
                    setDeleting({ kind: "ad", id: ad.id, label: ad.title });
                  },
                  ad.title
                )}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredAdvertisements.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No advertisements found
        </div>
      )}
    </div>
  );

  const currentPage = activeTab === "types" ? typesPage : adsPage;
  const totalPages = activeTab === "types" ? typesTotalPages : adsTotalPages;
  const totalItems = activeTab === "types" ? typesTotalItems : adsTotalItems;
  const currentItems =
    activeTab === "types"
      ? filteredTypes.length
      : filteredAdvertisements.length;

  return (
    <div>
      <AdminHeader
        title="Advertisement Management"
        description="Manage advertisement types and active advertisements"
      />
      <div className="advertisement-management">

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="advertisement-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`advertisement-tab ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="advertisement-controls">
        <div className="advertisement-search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={`Search ${
                activeTab === "types" ? "types" : "advertisements"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {activeTab === "types" && canCreateType && (
          <Button onClick={() => setTypeDialog({ open: true, type: null })}>
            <Plus className="w-4 h-4 mr-2" />
            New type
          </Button>
        )}
        {activeTab === "advertisements" && canCreateAd && (
          <Button onClick={() => setAdDialog({ open: true, ad: null })}>
            <Plus className="w-4 h-4 mr-2" />
            New advertisement
          </Button>
        )}
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card className="advertisement-content">
        {loading && currentItems === 0 ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === "types"
              ? renderTypesTable()
              : renderAdvertisementsTable()}

            {totalPages > 1 && (
              <div className="advertisement-pagination">
                <div className="pagination-info">
                  Showing {currentPage * pageSize + 1} to{" "}
                  {Math.min((currentPage + 1) * pageSize, totalItems)} of{" "}
                  {totalItems} entries
                </div>
                <div className="pagination-controls">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || loading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="page-number">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || loading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <AdvertisementTypeDialog
        open={typeDialog.open}
        onOpenChange={(open) => setTypeDialog((d) => ({ ...d, open }))}
        type={typeDialog.type}
        onSaved={handleRefresh}
      />
      <AdvertisementDialog
        open={adDialog.open}
        onOpenChange={(open) => setAdDialog((d) => ({ ...d, open }))}
        advertisement={adDialog.ad}
        onSaved={handleRefresh}
      />
      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={deleting?.kind === "type" ? "Delete advertisement type?" : "Delete advertisement?"}
        description={`"${deleting?.label ?? ""}" will be permanently deleted. This cannot be undone.`}
        error={deleteError}
        pending={deletePending}
        onConfirm={confirmDelete}
      />
      </div>
    </div>
  );
};

export default AdvertisementManagement;
