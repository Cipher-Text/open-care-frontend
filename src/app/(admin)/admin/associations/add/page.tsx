"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/admin-header";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { addAssociation, fetchAssociationTypes } from "@/api/associations";
import { fetchDivisions, fetchDistricts, fetchUpazilas } from "@/api/locations";
import { fetchMedicalSpecialities } from "@/api/medical-specialities";
import { getCountries } from "@/api/countries";
import { getDomains } from "@/api/domain";
import {
  addAssociationSchema,
  AddAssociationFormData,
} from "@/validations/add-association-schema";

export default function AddAssociationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(
    null
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
  const router = useRouter();

  // Fetch divisions
  const { data: divisions = [], isLoading: isDivisionsLoading } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivisions,
  });

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

  // Fetch association types
  const { data: associationTypes = [], isLoading: isAssociationTypesLoading } =
    useQuery({
      queryKey: ["association-types"],
      queryFn: fetchAssociationTypes,
    });

  // Fetch medical specialities
  const {
    data: medicalSpecialitiesData,
    isLoading: isMedicalSpecialitiesLoading,
  } = useQuery({
    queryKey: ["medical-specialities-all"],
    queryFn: () =>
      fetchMedicalSpecialities({
        page: 0,
        size: 1000,
        sort: "name",
        direction: "ASC",
      }),
  });

  const medicalSpecialities =
    medicalSpecialitiesData?.medicalSpecialities || [];

  // Fetch countries
  const { data: countriesData, isLoading: isCountriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await getCountries();
      return response.data || [];
    },
  });

  const countries = countriesData || [];

  // Fetch domains
  const { data: domainsData, isLoading: isDomainsLoading } = useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const response = await getDomains();
      return response.data || [];
    },
  });

  const domains = domainsData || [];

  const form = useForm<AddAssociationFormData>({
    resolver: zodResolver(addAssociationSchema),
    defaultValues: {
      name: "",
      bnName: "",
      shortName: "",
      associationType: "",
      medicalSpecialityId: null,
      description: "",
      logoUrl: "",
      foundedDate: "",
      websiteUrl: "",
      facebookUrl: "",
      twitterUrl: "",
      linkedinUrl: "",
      youtubeUrl: "",
      email: "",
      phone: "",
      divisionId: null,
      districtId: null,
      upazilaId: null,
      originCountry: "BANGLADESH",
      domain: "",
    },
  });

  // Filter districts based on selected division
  const filteredDistricts = districts.filter(
    (district) =>
      !selectedDivisionId || district.division.id === selectedDivisionId
  );

  // Filter upazilas based on selected district
  const filteredUpazilas = upazilas.filter(
    (upazila) =>
      !selectedDistrictId || upazila.district.id === selectedDistrictId
  );

  const onSubmit = async (data: AddAssociationFormData) => {
    try {
      setIsLoading(true);
      await addAssociation(data);
      toast.success("Association added successfully!");
      router.push("/admin/associations");
    } catch (error) {
      console.error("Error adding association:", error);
      toast.error("Failed to add association. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/associations");
  };

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Add New Association"
        description="Fill in the information to add a new medical association"
      >
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </AdminHeader>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Association Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter association name"
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
                        <FormLabel>Bengali Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="বাংলা নাম লিখুন" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter short name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="foundedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founded Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter association description"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Association Details */}
            <Card>
              <CardHeader>
                <CardTitle>Association Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="associationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Association Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isAssociationTypesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {associationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isDomainsLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select domain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {domains.map((domain) => (
                              <SelectItem
                                key={domain.value}
                                value={domain.value}
                              >
                                {domain.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalSpecialityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Speciality</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(
                              value === "none" ? null : parseInt(value)
                            )
                          }
                          value={field.value?.toString() || "none"}
                          disabled={isMedicalSpecialitiesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select speciality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {medicalSpecialities.map((speciality) => (
                              <SelectItem
                                key={speciality.id}
                                value={speciality.id.toString()}
                              >
                                {speciality.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="originCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin Country *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isCountriesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.displayNameEn} ({country.acronym})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="divisionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const divisionId =
                              value === "none" ? null : parseInt(value);
                            field.onChange(divisionId);
                            setSelectedDivisionId(divisionId);
                            form.setValue("districtId", null);
                            form.setValue("upazilaId", null);
                            setSelectedDistrictId(null);
                          }}
                          value={field.value?.toString() || "none"}
                          disabled={isDivisionsLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {divisions.map((division) => (
                              <SelectItem
                                key={division.id}
                                value={division.id.toString()}
                              >
                                {division.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="districtId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const districtId =
                              value === "none" ? null : parseInt(value);
                            field.onChange(districtId);
                            setSelectedDistrictId(districtId);
                            form.setValue("upazilaId", null);
                          }}
                          value={field.value?.toString() || "none"}
                          disabled={isDistrictsLoading || !selectedDivisionId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {filteredDistricts.map((district) => (
                              <SelectItem
                                key={district.id}
                                value={district.id.toString()}
                              >
                                {district.name}
                              </SelectItem>
                            ))}
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
                          onValueChange={(value) =>
                            field.onChange(
                              value === "none" ? null : parseInt(value)
                            )
                          }
                          value={field.value?.toString() || "none"}
                          disabled={isUpazilasLoading || !selectedDistrictId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select upazila" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {filteredUpazilas.map((upazila) => (
                              <SelectItem
                                key={upazila.id}
                                value={upazila.id.toString()}
                              >
                                {upazila.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="association@example.com"
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
                          <Input placeholder="+880 1XXX-XXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media & Links */}
            <Card>
              <CardHeader>
                <CardTitle>Media & Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://facebook.com/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://twitter.com/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://youtube.com/..."
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

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Association"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
