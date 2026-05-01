"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

import {
  addHospital,
  fetchHospitalById,
  updateHospital,
  fetchHospitalTypes,
  fetchOrganizationTypes,
} from "@/api/hospitals";
import {
  fetchDistricts,
  fetchUpazilas,
  fetchUnionsByUpazila,
} from "@/api/locations";
import {
  addHospitalSchema,
  AddHospitalFormInput,
  AddHospitalFormData,
} from "@/validations/add-hospital-schema";
import { Hospital } from "@/types/hospitals";

export default function HospitalFormPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<number | null>(
    null
  );

  const hospitalId = params.id === "new" ? null : (params.id as string);
  const isEditing = hospitalId !== null;

  const resolveSelectValue = (
    current:
      | {
          value?: string | null;
          englishName?: string | null;
          displayName?: string | null;
        }
      | null
      | undefined,
    options: Array<{
      value?: string | null;
      englishName?: string | null;
      displayName?: string | null;
    }>
  ) => {
    const candidates = [
      current?.value,
      current?.englishName,
      current?.displayName,
    ]
      .filter((entry): entry is string => Boolean(entry && entry.trim()))
      .map((entry) => entry.trim().toLowerCase());

    const match = options.find((option) => {
      const optionCandidates = [
        option.value,
        option.englishName,
        option.displayName,
      ]
        .filter((entry): entry is string => Boolean(entry && entry.trim()))
        .map((entry) => entry.trim().toLowerCase());
      return optionCandidates.some((entry) => candidates.includes(entry));
    });

    return (
      match?.value ||
      match?.englishName ||
      match?.displayName ||
      current?.value ||
      current?.englishName ||
      current?.displayName ||
      ""
    );
  };

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

  // Fetch unions when upazila is selected
  const { data: unions = [], isLoading: isUnionsLoading } = useQuery({
    queryKey: ["unions", selectedUpazilaId],
    queryFn: () => fetchUnionsByUpazila(selectedUpazilaId!),
    enabled: !!selectedUpazilaId,
  });

  // Fetch hospital types
  const { data: hospitalTypes = [], isLoading: isHospitalTypesLoading } =
    useQuery({
      queryKey: ["hospital-types"],
      queryFn: fetchHospitalTypes,
    });

  // Fetch organization types
  const {
    data: organizationTypes = [],
    isLoading: isOrganizationTypesLoading,
  } = useQuery({
    queryKey: ["organization-types"],
    queryFn: fetchOrganizationTypes,
  });

  const form = useForm<AddHospitalFormInput, unknown, AddHospitalFormData>({
    resolver: zodResolver(addHospitalSchema),
    defaultValues: {
      name: "",
      bnName: "",
      numberOfBed: 1,
      districtId: 1,
      upazilaId: 1,
      unionId: 1,
      hospitalType: "",
      organizationType: "",
      lat: undefined,
      lon: undefined,
      websiteUrl: "",
      imageUrl: "",
      registrationCode: "",
      slug: "",
      facebookPageUrl: "",
      twitterProfileUrl: "",
      email: "",
      phone: "",
      address: "",
      hasEmergencyService: false,
      hasAmbulanceService: false,
      hasBloodBank: false,
      isAffiliated: false,
      isActive: true,
    },
  });

  // Fetch hospital data if editing
  const {
    data: hospitalData,
    isLoading: isHospitalLoading,
    isError: isHospitalError,
  } = useQuery<Hospital>({
    queryKey: ["hospital", hospitalId],
    queryFn: () => fetchHospitalById(hospitalId!),
    enabled: isEditing,
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditing && hospitalData) {
      const upazilaId = hospitalData.upazila?.id ?? hospitalData.union?.upazila?.id ?? 1;
      const districtId =
        hospitalData.upazila?.district?.id ??
        hospitalData.district?.id ??
        hospitalData.union?.upazila?.district?.id ??
        1;

      form.reset({
        name: hospitalData.name || "",
        bnName: hospitalData.bnName || "",
        numberOfBed: hospitalData.numberOfBed ?? 1,
        districtId: districtId,
        upazilaId: upazilaId,
        unionId: hospitalData.union?.id ?? 1,
        hospitalType:
          hospitalData.hospitalType?.value ??
          hospitalData.hospitalType?.englishName ??
          "",
        organizationType:
          hospitalData.organizationType?.value ??
          hospitalData.organizationType?.displayName ??
          "",
        lat:
          hospitalData.lat === null ||
          hospitalData.lat === undefined ||
          hospitalData.lat === ""
            ? undefined
            : Number.isNaN(Number(hospitalData.lat))
            ? undefined
            : Number(hospitalData.lat),
        lon:
          hospitalData.lon === null ||
          hospitalData.lon === undefined ||
          hospitalData.lon === ""
            ? undefined
            : Number.isNaN(Number(hospitalData.lon))
            ? undefined
            : Number(hospitalData.lon),
        websiteUrl: hospitalData.websiteUrl || "",
        imageUrl: hospitalData.imageUrl || "",
        registrationCode: hospitalData.registrationCode || "",
        slug: hospitalData.slug || "",
        facebookPageUrl: hospitalData.facebookPageUrl || "",
        twitterProfileUrl: hospitalData.twitterProfileUrl || "",
        email: hospitalData.email || "",
        phone: hospitalData.phone || "",
        address: hospitalData.address || "",
        hasEmergencyService: hospitalData.hasEmergencyService ?? false,
        hasAmbulanceService: hospitalData.hasAmbulanceService ?? false,
        hasBloodBank: hospitalData.hasBloodBank ?? false,
        isAffiliated: hospitalData.isAffiliated ?? false,
        isActive: hospitalData.isActive ?? true,
      }); // Set selected location values for dropdowns
      setSelectedDistrictId(districtId);
      setSelectedUpazilaId(upazilaId);
    }
  }, [hospitalData, isEditing, form]);

  useEffect(() => {
    if (!isEditing || !hospitalData) {
      return;
    }

    if (hospitalTypes.length > 0) {
      form.setValue(
        "hospitalType",
        resolveSelectValue(hospitalData.hospitalType, hospitalTypes)
      );
    }

    if (organizationTypes.length > 0) {
      form.setValue(
        "organizationType",
        resolveSelectValue(hospitalData.organizationType, organizationTypes)
      );
    }
  }, [hospitalTypes, organizationTypes, hospitalData, isEditing, form]);

  // Set initial selected values for new hospital
  useEffect(() => {
    if (!isEditing) {
      const formValues = form.getValues();
      const districtId =
        typeof formValues.districtId === "number"
          ? formValues.districtId
          : typeof formValues.districtId === "string" &&
            formValues.districtId.trim() !== "" &&
            !Number.isNaN(Number(formValues.districtId))
          ? Number(formValues.districtId)
          : null;
      const upazilaId =
        typeof formValues.upazilaId === "number"
          ? formValues.upazilaId
          : typeof formValues.upazilaId === "string" &&
            formValues.upazilaId.trim() !== "" &&
            !Number.isNaN(Number(formValues.upazilaId))
          ? Number(formValues.upazilaId)
          : null;

      setSelectedDistrictId(districtId ?? 1);
      setSelectedUpazilaId(upazilaId ?? 1);
    }
  }, [isEditing, form]);

  // Filter upazilas based on selected district
  const filteredUpazilas = upazilas.filter(
    (upazila) =>
      !selectedDistrictId || upazila.district.id === selectedDistrictId
  );

  // Filter unions based on selected upazila
  const filteredUnions = unions;

  const onSubmit = async (data: AddHospitalFormData) => {
    try {
      setIsLoading(true);

      if (isEditing) {
        await updateHospital(hospitalId!, data);
        toast.success("Hospital updated successfully!");
      } else {
        await addHospital(data);
        toast.success("Hospital added successfully!");
      }

      // Invalidate and refetch the hospitals list
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });

      // Navigate back to hospitals list
      router.push("/admin/hospitals");
    } catch (error) {
      console.error("Error saving hospital:", error);
      toast.error(
        isEditing ? "Failed to update hospital" : "Failed to add hospital"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/hospitals");
  };

  if (isEditing && isHospitalLoading) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Loading Hospital..."
          description="Please wait while we load the hospital information"
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

  if (isEditing && isHospitalError) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="Error"
          description="Failed to load hospital information"
        />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                Failed to load hospital data. Please try again.
                <div className="mt-4">
                  <Button onClick={handleBack} variant="outline">
                    Back to List
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
        title={isEditing ? "Edit Hospital" : "Add New Hospital"}
        description={
          isEditing
            ? "Update hospital information and save changes"
            : "Fill in the information to add a new hospital to the system"
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
                        <FormLabel>Hospital Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter hospital name" {...field} />
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
                          <Input placeholder="বাংলা নাম লিখুন" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfBed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Beds</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter number of beds"
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            disabled={field.disabled}
                            value={
                              typeof field.value === "number" ||
                              typeof field.value === "string"
                                ? field.value
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hospitalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          disabled={isHospitalTypesLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select hospital type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isHospitalTypesLoading ? (
                              <SelectItem
                                value="hospital-types-loading"
                                disabled
                              >
                                Loading hospital types...
                              </SelectItem>
                            ) : (
                              hospitalTypes
                                .filter(
                                  (type) =>
                                    type.englishName &&
                                    type.englishName.trim() !== ""
                                )
                                .map((type) => {
                                  const optionValue =
                                    type.value || type.englishName;
                                  return (
                                    <SelectItem
                                      key={optionValue}
                                      value={optionValue}
                                    >
                                      {type.englishName} ({type.banglaName})
                                    </SelectItem>
                                  );
                                })
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          disabled={isOrganizationTypesLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isOrganizationTypesLoading ? (
                              <SelectItem
                                value="organization-types-loading"
                                disabled
                              >
                                Loading organization types...
                              </SelectItem>
                            ) : (
                              organizationTypes
                                .filter(
                                  (type) =>
                                    (type.value || type.displayName) &&
                                    (
                                      type.value ||
                                      type.displayName ||
                                      ""
                                    ).trim() !== ""
                                )
                                .map((type) => {
                                  const optionValue =
                                    type.value || type.displayName || "";
                                  const label =
                                    type.displayName ||
                                    type.englishName ||
                                    optionValue;
                                  return (
                                    <SelectItem
                                      key={optionValue}
                                      value={optionValue}
                                    >
                                      {label} ({type.banglaName})
                                    </SelectItem>
                                  );
                                })
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registrationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Code (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter registration code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="hospital-slug" {...field} />
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
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Online</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebookPageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook Page URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="facebook.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitterProfileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Profile URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="twitter.com/..." {...field} />
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
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
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
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+880..." {...field} />
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
                        <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="districtId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const districtId = Number(value);
                            field.onChange(districtId);
                            setSelectedDistrictId(districtId);
                            // Reset upazila and union when district changes
                            form.setValue("upazilaId", 1);
                            form.setValue("unionId", 1);
                            setSelectedUpazilaId(null);
                          }}
                          value={
                            typeof field.value === "number" ||
                            typeof field.value === "string"
                              ? String(field.value)
                              : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isDistrictsLoading ? (
                              <SelectItem value="districts-loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              districts.map((district) => (
                                <SelectItem
                                  key={district.id}
                                  value={district.id.toString()}
                                >
                                  {district.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={(value) => {
                            const upazilaId = Number(value);
                            field.onChange(upazilaId);
                            setSelectedUpazilaId(upazilaId);
                            // Reset union when upazila changes
                            form.setValue("unionId", 1);
                          }}
                          value={
                            typeof field.value === "number" ||
                            typeof field.value === "string"
                              ? String(field.value)
                              : ""
                          }
                          disabled={!selectedDistrictId}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select upazila" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isUpazilasLoading ? (
                              <SelectItem value="upazilas-loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              filteredUpazilas.map((upazila) => (
                                <SelectItem
                                  key={upazila.id}
                                  value={upazila.id.toString()}
                                >
                                  {upazila.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Union</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            typeof field.value === "number" ||
                            typeof field.value === "string"
                              ? String(field.value)
                              : ""
                          }
                          disabled={!selectedUpazilaId}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select union" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isUnionsLoading ? (
                              <SelectItem value="unions-loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              filteredUnions.map((union) => (
                                <SelectItem
                                  key={union.id}
                                  value={union.id.toString()}
                                >
                                  {union.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
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
                              placeholder="23.7104"
                              name={field.name}
                              onBlur={field.onBlur}
                              ref={field.ref}
                              disabled={field.disabled}
                              value={
                                typeof field.value === "number" ||
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                field.onChange(
                                  nextValue === ""
                                    ? undefined
                                    : Number.parseFloat(nextValue)
                                );
                              }}
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
                              placeholder="90.4074"
                              name={field.name}
                              onBlur={field.onBlur}
                              ref={field.ref}
                              disabled={field.disabled}
                              value={
                                typeof field.value === "number" ||
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                field.onChange(
                                  nextValue === ""
                                    ? undefined
                                    : Number.parseFloat(nextValue)
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="hasEmergencyService"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Emergency Service</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Supports emergency care.
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasAmbulanceService"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ambulance Service</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Provides ambulance services.
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasBloodBank"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Blood Bank</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Has blood bank facilities.
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isAffiliated"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Affiliated</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Affiliated with another institution.
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Show this hospital as active.
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
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
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                  ? "Update Hospital"
                  : "Add Hospital"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
