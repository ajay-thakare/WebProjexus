"use client";
import { Agency } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FileUpload from "../global/file-upload";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "@tremor/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import {
  deleteAgency,
  initUser,
  saveActivityLogsNotification,
  upsertAgency,
} from "@/lib/queries";
import { Button } from "../ui/button";
import Loading from "../global/loading";

type Props = {
  data?: Partial<Agency>;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Agency name must be at least 3 characters" }),
  companyEmail: z.string().email({ message: "Invalid email address" }),
  companyPhone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
  whiteLabel: z.boolean().default(false),
  address: z.string().min(1, { message: "Address is required" }).trim(),
  city: z.string().min(1, { message: "City is required" }).trim(),
  zipCode: z
    .string()
    .regex(/^[0-9]{5,6}$/, "Enter a valid PIN code (6 digits)"),
  state: z.string().min(1, { message: "State is required" }).trim(),
  country: z.string().min(1, { message: "Country is required" }).trim(),
  agencyLogo: z.string().optional().default(""),
  goal: z.number().min(1, { message: "Goal must be at least 1" }).default(5),
});

export default function AgencyDetails({ data }: Props) {
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || "",
      companyEmail: data?.companyEmail || "",
      companyPhone: data?.companyPhone || "",
      whiteLabel: data?.whiteLabel || false,
      address: data?.address || "",
      city: data?.city || "",
      zipCode: data?.zipCode || "",
      state: data?.state || "",
      country: data?.country || "",
      agencyLogo: data?.agencyLogo || "",
      goal: data?.goal || 5,
    },
  });

  const isLoading = form.formState.isSubmitting || isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const onValidSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      let custId = "";

      // For new agency creation
      if (!data?.id) {
        console.log("Creating new agency with values:", values);

        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.state,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.state,
          },
        };

        try {
          console.log("Making request to Stripe API");
          const customerResponse = await fetch("/api/stripe/create-customer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          });

          if (!customerResponse.ok) {
            const errorData = await customerResponse.text();
            console.error("Stripe API error:", errorData);
            throw new Error(`Stripe customer creation failed: ${errorData}`);
          }

          const customerData = await customerResponse.json();
          custId = customerData.customerId;

          // Initialize user only after successful stripe customer creation
          await initUser({ role: "AGENCY_OWNER" });
        } catch (error) {
          console.error("Error creating Stripe customer:", error);
          throw new Error(
            `Failed to create customer: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      // Prepare agency data
      const agencyData = {
        id: data?.id ? data.id : v4(),
        customerId: data?.customerId || custId,
        address: values.address,
        agencyLogo: values.agencyLogo || "",
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        whiteLabel: values.whiteLabel,
        zipCode: values.zipCode,
        createdAt: data?.createdAt || new Date(),
        updatedAt: new Date(),
        companyEmail: values.companyEmail,
        connectAccountId: data?.connectAccountId || "",
        goal: values.goal,
      };

      const response = await upsertAgency(agencyData);

      if (!data?.id) {
        toast.success("Agency created successfully!");
        console.log("New agency created, refreshing page");
        router.refresh();
      } else {
        toast.success("Agency details updated successfully!");

        await saveActivityLogsNotification({
          agencyId: data.id,
          description: `Updated agency information`,
          subaccountId: undefined,
        });

        console.log("Agency updated, refreshing page");
        router.refresh();
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not save agency details";
      setFormError(errorMessage);
      toast.error(`Oops! ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);

    try {
      await toast.promise(deleteAgency(data.id), {
        loading: "Deleting agency...",
        success: "Agency deleted successfully!",
        error: "Failed to delete agency",
      });

      router.refresh();
    } catch (error) {
      console.error("Error deleting agency:", error);
    } finally {
      setDeletingAgency(false);
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Create an agency for your business. You can edit agency settings
            later from the agency settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onValidSubmit)}
              className="space-y-4"
            >
              {formError && (
                <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm mb-4">
                  Error: {formError}
                </div>
              )}

              <FormField
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Agency Name"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input
                          readOnly={!!data?.id}
                          placeholder="Email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Agency Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whiteLabel"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                      <div>
                        <FormLabel>Whitelabel Agency</FormLabel>
                        <FormDescription>
                          Turning on whitelabel mode will show your agency logo
                          to all sub accounts by default. You can overwrite this
                          functionality through sub account settings.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St..."
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PIN Code"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Country"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {data?.id && (
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Goal</FormLabel>
                      <FormDescription>
                        ✨ Create a goal for your agency. As your business grows
                        your goals grow too.
                      </FormDescription>
                      <FormControl>
                        <NumberInput
                          min={1}
                          className="bg-background !border !border-input"
                          placeholder="Sub Account Goal"
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={Boolean(isLoading)}
                  className={
                    !form.formState.isDirty && data?.id
                      ? "text-muted-foreground"
                      : "bg-primary hover:bg-primary/90"
                  }
                >
                  {isLoading ? (
                    <Loading />
                  ) : !data?.id ? (
                    "Create Your Agency"
                  ) : form.formState.isDirty ? (
                    "Save Agency Information"
                  ) : (
                    "No changes made"
                  )}
                </Button>
              </div>

              {Object.keys(form.formState.errors).length > 0 && (
                <div className="text-sm text-red-500 mt-2">
                  Please correct the form errors before submitting.
                </div>
              )}
            </form>
          </Form>

          {data?.id && (
            <div className="flex flex-col md:flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-6">
              <div className="font-semibold text-destructive">Danger Zone</div>
              <div className="text-muted-foreground text-sm">
                Deleting your agency cannot be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to media, contacts etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap transition-colors"
              >
                {deletingAgency ? "Deleting..." : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive/90"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
