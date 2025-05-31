"use client";

import { Agency, SubAccount } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FileUpload from "../global/file-upload";
import { v4 } from "uuid";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";

import {
  deleteSubAccount,
  saveActivityLogsNotification,
  upsertSubAccount,
} from "@/lib/queries";
import Loading from "../global/loading";
import { useModal } from "@/providers/modal-provider";
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
import { NumberInput } from "@tremor/react";

const formSchema = z.object({
  name: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string().min(1),
  address: z.string(),
  city: z.string(),
  subAccountLogo: z.string(),
  zipCode: z.string(),
  state: z.string(),
  country: z.string(),
});

//CHALLENGE Give access for Subaccount Guest they should see a different view maybe a form that allows them to create tickets

//CHALLENGE layout.tsx oonly runs once as a result if you remove permissions for someone and they keep navigating the layout.tsx wont fire again. solution- save the data inside metadata for current user.

type SubAccountDetailsProps = {
  //To add the sub account to the agency
  agencyDetails: Agency;
  details?: Partial<SubAccount>;
  userId: string;
  userName: string;
};

const SubAccountDetails = ({
  details,
  agencyDetails,
  userId,
  userName,
}: SubAccountDetailsProps) => {
  const { setClose } = useModal();
  const router = useRouter();
  const [deletingSubAccount, setDeletingSubAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: details?.name ?? "",
      companyEmail: details?.companyEmail ?? "",
      companyPhone: details?.companyPhone ?? "",
      address: details?.address ?? "",
      city: details?.city ?? "",
      zipCode: details?.zipCode ?? "",
      state: details?.state ?? "",
      country: details?.country ?? "",
      subAccountLogo: details?.subAccountLogo ?? "",
    },
  });

  const isLoading = form.formState.isSubmitting || isSubmitting;

  useEffect(() => {
    if (details) {
      form.reset(details);
    }
  }, [details]);

  const onValidSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Prepare sub account data
      const subAccountData = {
        id: details?.id ? details.id : v4(),
        address: values.address,
        subAccountLogo: values.subAccountLogo || "",
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        zipCode: values.zipCode,
        createdAt: details?.createdAt || new Date(),
        updatedAt: new Date(),
        companyEmail: values.companyEmail,
        agencyId: agencyDetails.id,
        connectAccountId: details?.connectAccountId || "",
        goal: 5000,
      };

      const response = await upsertSubAccount(subAccountData);
      if (!response) throw new Error("Failed to save sub account details");

      await saveActivityLogsNotification({
        agencyId: response.agencyId,
        description: `${userName} | ${
          !details?.id ? "created" : "updated"
        } sub account | ${response.name}`,
        subaccountId: response.id,
      });

      if (!details?.id) {
        toast.success("Sub account created successfully!");
      } else {
        toast.success("Sub account details updated successfully!");
      }

      if (setClose) {
        setClose();
      }

      router.refresh();
    } catch (error) {
      console.error("Error during form submission:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not save sub account details";
      setFormError(errorMessage);
      toast.error(`Oops! ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubAccount = async () => {
    if (!details?.id) return;
    setDeletingSubAccount(true);

    try {
      await toast.promise(deleteSubAccount(details.id), {
        loading: "Deleting sub account...",
        success: "Sub account deleted successfully!",
        error: "Failed to delete sub account",
      });

      // Save activity log
      await saveActivityLogsNotification({
        agencyId: agencyDetails.id,
        description: `${userName} | deleted sub account | ${details.name}`,
        subaccountId: undefined,
      });

      if (setClose) {
        setClose();
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting sub account:", error);
    } finally {
      setDeletingSubAccount(false);
    }
  };

  //Todo: Create this form.
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sub Account Information</CardTitle>
          <CardDescription>
            {!details?.id
              ? "Create a sub account for your agency. You can edit sub account settings later."
              : "Edit sub account details and settings."}
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
                name="subAccountLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Account Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="subaccountLogo"
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
                      <FormLabel>Sub Account Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Sub Account Name"
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
                      <FormLabel>Sub Account Email</FormLabel>
                      <FormControl>
                        <Input
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
                    <FormLabel>Sub Account Phone Number</FormLabel>
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

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={Boolean(isLoading)}
                  className={
                    !form.formState.isDirty && details?.id
                      ? "text-muted-foreground"
                      : "bg-primary hover:bg-primary/90"
                  }
                >
                  {isLoading ? (
                    <Loading />
                  ) : !details?.id ? (
                    "Create Sub Account"
                  ) : form.formState.isDirty ? (
                    "Save Sub Account Information"
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

          {details?.id && (
            <div className="flex flex-col md:flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-6">
              <div className="font-semibold text-destructive">Danger Zone</div>
              <div className="text-muted-foreground text-sm">
                Deleting this sub account cannot be undone. This will
                permanently delete all data related to this sub account
                including funnels, contacts, media, and pipelines.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingSubAccount}
                className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap transition-colors"
              >
                {deletingSubAccount ? "Deleting..." : "Delete Sub Account"}
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
                sub account and all related data including funnels, contacts,
                media, and pipelines.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingSubAccount}
                className="bg-destructive hover:bg-destructive/90"
                onClick={handleDeleteSubAccount}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};
export default SubAccountDetails;
