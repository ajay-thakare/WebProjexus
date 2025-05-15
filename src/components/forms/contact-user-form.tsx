"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ContactUserFormSchema } from "@/lib/types";
import { saveActivityLogsNotification, upsertContact } from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import toast from "react-hot-toast";

interface ContactUserFormProps {
  subaccountId: string;
  contactData?: {
    id: string;
    name: string;
    email: string;
  };
}

export const ContactUserForm = ({
  subaccountId,
  contactData,
}: ContactUserFormProps) => {
  const { setClose, data } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof ContactUserFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ContactUserFormSchema),
    defaultValues: {
      name: contactData?.name || "",
      email: contactData?.email || "",
    },
  });

  useEffect(() => {
    if (data.contact) {
      form.reset(data.contact);
    }
  }, [data, form]);

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (
    values: z.infer<typeof ContactUserFormSchema>
  ) => {
    try {
      const response = await upsertContact({
        id: contactData?.id,
        email: values.email,
        subAccountId: subaccountId,
        name: values.name,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `${contactData?.id ? "Updated" : "Created"} contact | ${
          response?.name
        }`,
        subaccountId,
      });

      toast.success(
        `Contact ${contactData?.id ? "updated" : "created"} successfully`
      );

      setClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        `Could not ${contactData?.id ? "update" : "create"} contact details`
      );
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">
          {contactData?.id ? "Edit Contact" : "Contact Info"}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {contactData?.id
            ? "Update contact information"
            : "Assign tickets to contacts and set values for each contact"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            <div className="space-y-4 sm:space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        disabled={isLoading}
                        {...field}
                        className="h-9 sm:h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        disabled={isLoading}
                        {...field}
                        className="h-9 sm:h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 h-9 sm:h-10 text-sm sm:text-base"
            >
              {isLoading ? (
                <Loading />
              ) : contactData?.id ? (
                "Update Contact"
              ) : (
                "Save Contact Details"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
