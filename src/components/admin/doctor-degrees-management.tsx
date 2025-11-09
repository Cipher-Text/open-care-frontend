"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";

import {
  addDoctorDegree,
  updateDoctorDegree,
  deleteDoctorDegree,
  AddDoctorDegreeData,
  DoctorDegreeResponse,
} from "@/api/doctors";
import { fetchDegrees, Degree } from "@/api/degrees";
import { fetchMedicalSpecialities } from "@/api/medical-specialities";
import { fetchInstitutions } from "@/api/institutions";
import { MedicalSpeciality } from "@/types/medical-specialities";
import { Institution } from "@/types/institutions";

interface DoctorDegreesManagementProps {
  doctorId: number;
  initialDegrees?: DoctorDegreeResponse[];
  onUpdate?: () => void;
}

interface DegreeFormData {
  degreeId: number;
  medicalSpecialityId: number;
  institutionId: number;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
  endDateValid: boolean;
}

const DoctorDegreesManagement: React.FC<DoctorDegreesManagementProps> = ({
  doctorId,
  initialDegrees = [],
  onUpdate,
}) => {
  const [degrees, setDegrees] =
    useState<DoctorDegreeResponse[]>(initialDegrees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingDegree, setEditingDegree] =
    useState<DoctorDegreeResponse | null>(null);
  const [formData, setFormData] = useState<DegreeFormData>({
    degreeId: 0,
    medicalSpecialityId: 0,
    institutionId: 0,
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
    endDateValid: true,
  });

  // Fetch degrees
  const { data: degreesData = [] } = useQuery({
    queryKey: ["degrees"],
    queryFn: fetchDegrees,
  });

  // Fetch medical specialities
  const { data: specialitiesData } = useQuery({
    queryKey: ["medical-specialities"],
    queryFn: () => fetchMedicalSpecialities({}),
  });

  // Fetch institutions
  const { data: institutionsData } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => fetchInstitutions({}),
  });

  useEffect(() => {
    setDegrees(initialDegrees);
  }, [initialDegrees]);

  const handleOpenDialog = (degree?: DoctorDegreeResponse) => {
    if (degree) {
      setEditingDegree(degree);
      setFormData({
        degreeId: degree.degree.id,
        medicalSpecialityId: degree.medicalSpeciality.id,
        institutionId: degree.institution.id,
        startDate: degree.startDate,
        endDate: degree.endDate,
        grade: degree.grade || "",
        description: degree.description || "",
        endDateValid: true,
      });
    } else {
      setEditingDegree(null);
      setFormData({
        degreeId: 0,
        medicalSpecialityId: 0,
        institutionId: 0,
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
        endDateValid: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDegree(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const degreeData: AddDoctorDegreeData = {
        doctorId,
        ...formData,
      };

      if (editingDegree) {
        // Update existing degree
        const updated = await updateDoctorDegree(
          doctorId,
          editingDegree.id,
          degreeData
        );
        setDegrees((prev) =>
          prev.map((d) => (d.id === editingDegree.id ? updated : d))
        );
        toast.success("Degree updated successfully!");
      } else {
        // Add new degree
        const newDegree = await addDoctorDegree(degreeData);
        setDegrees((prev) => [...prev, newDegree]);
        toast.success("Degree added successfully!");
      }

      handleCloseDialog();
      onUpdate?.();
    } catch (error) {
      console.error("Error saving degree:", error);
      toast.error(
        editingDegree ? "Failed to update degree" : "Failed to add degree"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (degreeId: number) => {
    if (!confirm("Are you sure you want to delete this degree?")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteDoctorDegree(doctorId, degreeId);
      setDegrees((prev) => prev.filter((d) => d.id !== degreeId));
      toast.success("Degree deleted successfully!");
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting degree:", error);
      toast.error("Failed to delete degree");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof DegreeFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Doctor Degrees</CardTitle>
        <Button
          onClick={() => handleOpenDialog()}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Degree
        </Button>
      </CardHeader>
      <CardContent>
        {degrees.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No degrees added yet. Click &quot;Add Degree&quot; to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {degrees.map((degree) => (
              <div
                key={degree.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">
                      {degree.degree.abbreviation ||
                        degree.degree.name ||
                        "Unknown Degree"}
                    </h4>
                    {degree.degree.degreeType && (
                      <Badge variant="secondary">
                        {degree.degree.degreeType.displayName}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {degree.institution.name && (
                      <p>
                        <span className="font-medium">Institution:</span>{" "}
                        {degree.institution.name}
                      </p>
                    )}
                    {degree.medicalSpeciality.name && (
                      <p>
                        <span className="font-medium">Speciality:</span>{" "}
                        {degree.medicalSpeciality.name}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {degree.startDate} to {degree.endDate}
                    </p>
                    {degree.grade && (
                      <p>
                        <span className="font-medium">Grade:</span>{" "}
                        {degree.grade}
                      </p>
                    )}
                    {degree.description && (
                      <p className="mt-2">
                        <span className="font-medium">Description:</span>{" "}
                        {degree.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(degree)}
                    disabled={isLoading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(degree.id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDegree ? "Edit Degree" : "Add New Degree"}
              </DialogTitle>
              <DialogDescription>
                {editingDegree
                  ? "Update the degree information below"
                  : "Fill in the information to add a new degree"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="degreeId">Degree *</Label>
                  <SearchableSelect
                    value={formData.degreeId.toString()}
                    onValueChange={(value) =>
                      handleInputChange("degreeId", Number(value))
                    }
                    placeholder="Select degree"
                    searchPlaceholder="Search degrees..."
                    emptyText="No degree found."
                    options={degreesData.map((degree: Degree) => ({
                      value: degree.id.toString(),
                      label: `${degree.abbreviation} - ${degree.name}`,
                    }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="medicalSpecialityId">
                    Medical Speciality *
                  </Label>
                  <SearchableSelect
                    value={formData.medicalSpecialityId.toString()}
                    onValueChange={(value) =>
                      handleInputChange("medicalSpecialityId", Number(value))
                    }
                    placeholder="Select speciality"
                    searchPlaceholder="Search specialities..."
                    emptyText="No speciality found."
                    options={
                      specialitiesData?.medicalSpecialities?.map(
                        (spec: MedicalSpeciality) => ({
                          value: spec.id.toString(),
                          label: spec.name,
                        })
                      ) || []
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="institutionId">Institution *</Label>
                  <SearchableSelect
                    value={formData.institutionId.toString()}
                    onValueChange={(value) =>
                      handleInputChange("institutionId", Number(value))
                    }
                    placeholder="Select institution"
                    searchPlaceholder="Search institutions..."
                    emptyText="No institution found."
                    options={
                      institutionsData?.institutions?.map(
                        (inst: Institution) => ({
                          value: inst.id.toString(),
                          label: inst.name,
                        })
                      ) || []
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    type="text"
                    placeholder="Enter grade (e.g., A+, First Class)"
                    value={formData.grade}
                    onChange={(e) => handleInputChange("grade", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter additional details about this degree"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading
                    ? "Saving..."
                    : editingDegree
                    ? "Update"
                    : "Add Degree"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DoctorDegreesManagement;
