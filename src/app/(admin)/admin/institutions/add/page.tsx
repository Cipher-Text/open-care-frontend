"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { addInstitution } from "@/api/institutions";
import { fetchDistricts, fetchUpazilas } from "@/api/locations";
import {
  addInstitutionSchema,
  AddInstitutionFormData,
} from "@/validations/add-institution-schema";
import { District, Upazila } from "@/types/locations";

export default function AddInstitutionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
  const router = useRouter();

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

  // Set initial selected values based on form defaults
  useEffect(() => {
    const formValues = form.getValues();
    setSelectedDistrictId(formValues.districtId);
  }, [form]);

  const onSubmit = async (data: AddInstitutionFormData) => {
    try {
      setIsLoading(true);
      await addInstitution(data);
      toast.success("Institution added successfully!");
      router.push("/admin/institutions");
    } catch (error) {
      console.error("Error adding institution:", error);
      toast.error("Failed to add institution. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Add New Institution"
        description="Fill in the information to add a new educational institution to the system"
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
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
                          defaultValue={field.value}
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
                          defaultValue={field.value}
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
                          defaultValue={field.value}
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
                  <div className="space-y-4 pt-4 border-t">
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
                                  field.onChange(Number(e.target.value) || 0)
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
                  <div className="space-y-4 pt-4 border-t">
                    <FormField
                      control={form.control}
                      name="affiliated"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Affiliated Institution
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Is this institution affiliated with a hospital?
                            </div>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/institutions")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Institution"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
