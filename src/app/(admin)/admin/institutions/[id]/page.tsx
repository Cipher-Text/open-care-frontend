"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { AdminHeader } from "@/components/admin/admin-header";

import {
  addInstitutionSchema,
  AddInstitutionFormData,
} from "@/validations/add-institution-schema";
import {
  addInstitution,
  fetchInstitutionById,
  updateInstitution,
} from "@/api/institutions";
import { fetchDistricts, fetchUpazilas } from "@/api/locations";
import { Institution } from "@/types/institutions";
import { District, Upazila } from "@/types/locations";

export default function InstitutionFormPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );

  const institutionId = params.id === "add" ? null : (params.id as string);
  const isEditing = institutionId !== null;

  // Fetch districts
  const { data: districts = [], isLoading: isDistrictsLoading } = useQuery({
    queryKey: ["districts"],
    queryFn: fetchDistricts,
  });

  // Fetch upazilas
  const { data: upazilas = [], isLoading: isUpazilasLoading } = useQuery({
    queryKey: ["upazilas"],
    queryFn: fetchUpazilas,
  });

  const form = useForm<AddInstitutionFormData>({
    resolver: zodResolver(addInstitutionSchema),
    defaultValues: {
      name: "",
      bnName: "",
      acronym: "",
      email: "",
      phone: "",
      address: "",
      establishedYear: new Date().getFullYear(),
      enroll: 0,
      websiteUrl: "",
      imageUrl: "",
      districtId: 1,
      upazilaId: 1,
      lat: 0,
      lon: 0,
      institutionTypeValue: "",
      organizationTypeValue: "",
      countryValue: "BD",
      affiliatedHospitalId: undefined,
      affiliated: false,
      description: "",
      locationWkt: "",
    },
  });

  // Fetch institution data if editing
  const {
    data: institutionData,
    isLoading: isInstitutionLoading,
    isError: isInstitutionError,
  } = useQuery<Institution>({
    queryKey: ["institution", institutionId],
    queryFn: () => fetchInstitutionById(institutionId!),
    enabled: isEditing,
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditing && institutionData) {
      const districtId = institutionData.district?.id || 1;
      const upazilaId = institutionData.upazila?.id || 1;

      form.reset({
        name: institutionData.name || "",
        bnName: institutionData.bnName || "",
        acronym: institutionData.acronym || "",
        email: institutionData.email || "",
        phone: institutionData.phone || "",
        address: institutionData.address || "",
        establishedYear:
          institutionData.establishedYear || new Date().getFullYear(),
        enroll: institutionData.enroll || 0,
        websiteUrl: institutionData.websiteUrl || "",
        imageUrl: institutionData.imageUrl || "",
        districtId: districtId,
        upazilaId: upazilaId,
        lat: institutionData.lat || 0,
        lon: institutionData.lon || 0,
        institutionTypeValue: institutionData.institutionType?.value || "",
        organizationTypeValue: institutionData.organizationType?.value || "",
        countryValue: institutionData.country?.value || "BD",
        affiliatedHospitalId: institutionData.affiliatedHospital?.id,
        affiliated: institutionData.affiliated || false,
        description: "",
        locationWkt: institutionData.locationWkt || "",
      });

      // Set selected location values for dropdowns
      setSelectedDistrictId(districtId);
    }
  }, [institutionData, isEditing, form]);

  // Set initial selected values for new institution
  useEffect(() => {
    if (!isEditing) {
      const formValues = form.getValues();
      setSelectedDistrictId(formValues.districtId);
    }
  }, [isEditing, form]);

  const onSubmit = async (data: AddInstitutionFormData) => {
    try {
      setIsLoading(true);

      if (isEditing) {
        await updateInstitution(institutionId!, data);
        toast.success("Institution updated successfully!");
      } else {
        await addInstitution(data);
        toast.success("Institution added successfully!");
      }

      // Invalidate and refetch the institutions list
      queryClient.invalidateQueries({ queryKey: ["institutions"] });

      // Navigate back to institutions list
      router.push("/admin/institutions");
    } catch (error) {
      console.error("Error saving institution:", error);
      toast.error(
        isEditing ? "Failed to update institution" : "Failed to add institution"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/institutions");
  };

  if (isEditing && isInstitutionLoading) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Loading Institution..."
          description="Please wait while we load the institution information"
        />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isEditing && isInstitutionError) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Error"
          description="Failed to load institution information"
        />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                Failed to load institution data. Please try again.
                <div className="mt-4">
                  <Button onClick={handleBack} variant="outline">
                    Back to Institutions List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={isEditing ? "Edit Institution" : "Add New Institution"}
        description={
          isEditing
            ? "Update institution information and save changes"
            : "Fill in the information to add a new educational institution to the system"
        }
      >
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </AdminHeader>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter institution name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bnName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bengali Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Bengali name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="acronym"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Acronym</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter acronym (e.g., DU, BUET)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter website URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Institution Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Institution Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="establishedYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Established Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter establishment year"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enroll"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enrollment</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter total enrollment"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="institutionTypeValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select institution type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UNIVERSITY">
                              University
                            </SelectItem>
                            <SelectItem value="COLLEGE">College</SelectItem>
                            <SelectItem value="SCHOOL">School</SelectItem>
                            <SelectItem value="INSTITUTE">Institute</SelectItem>
                            <SelectItem value="ACADEMY">Academy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organizationTypeValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PUBLIC">Public</SelectItem>
                            <SelectItem value="PRIVATE">Private</SelectItem>
                            <SelectItem value="GOVERNMENT">
                              Government
                            </SelectItem>
                            <SelectItem value="NON_PROFIT">
                              Non-Profit
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="countryValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BD">Bangladesh</SelectItem>
                            <SelectItem value="IN">India</SelectItem>
                            <SelectItem value="PK">Pakistan</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Location Information</h4>
                    <FormField
                      control={form.control}
                      name="districtId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              value={field.value?.toString()}
                              onValueChange={(value) => {
                                const districtId = Number(value);
                                field.onChange(districtId);
                                setSelectedDistrictId(districtId);
                                // Reset upazila when district changes
                                form.setValue("upazilaId", 1);
                              }}
                              placeholder="Select district"
                              searchPlaceholder="Search districts..."
                              emptyText="No district found."
                              disabled={isDistrictsLoading}
                              options={districts.map((district: District) => ({
                                value: district.id.toString(),
                                label: district.name,
                              }))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="upazilaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upazila</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              value={field.value?.toString()}
                              onValueChange={(value) => {
                                field.onChange(Number(value));
                              }}
                              placeholder="Select upazila"
                              searchPlaceholder="Search upazilas..."
                              emptyText="No upazila found."
                              disabled={
                                isUpazilasLoading || !selectedDistrictId
                              }
                              options={upazilas
                                .filter(
                                  (upazila: Upazila) =>
                                    upazila.district.id === selectedDistrictId
                                )
                                .map((upazila: Upazila) => ({
                                  value: upazila.id.toString(),
                                  label: upazila.name,
                                }))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="lat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="any"
                                placeholder="Enter latitude"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitude (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="any"
                                placeholder="Enter longitude"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="affiliated"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Affiliated Institution</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Is this institution affiliated with a hospital?
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Institution" : "Add Institution"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
