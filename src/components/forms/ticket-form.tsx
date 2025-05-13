"use client";
import {
  getSubAccountTeamMembers,
  saveActivityLogsNotification,
  searchContacts,
  upsertTicket,
} from "@/lib/queries";
import { TicketFormSchema, TicketWithTags } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Tag, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckIcon, ChevronsUpDown, User2 } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import TagCreator from "../global/tag-creator";

type Props = {
  laneId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
  defaultData?: TicketWithTags[0];
};

const TicketForm = ({
  laneId,
  subaccountId,
  getNewTicket,
  defaultData: propDefaultData,
}: Props) => {
  const { data: modalData, setClose } = useModal();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState("");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);

  // Use either the prop defaultData or modalData.ticket for initialization
  const currentTicket: TicketWithTags[0] | undefined =
    propDefaultData || modalData?.ticket;

  const [assignedTo, setAssignedTo] = useState(
    currentTicket?.Assigned?.id || ""
  );

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: currentTicket?.name || "",
      description: currentTicket?.description || "",
      value: String(currentTicket?.value || 0),
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const isFormLoading = form.formState.isLoading;

  // Fetch team members once on mount
  useEffect(() => {
    if (subaccountId) {
      const fetchTeamMembers = async () => {
        try {
          const response = await getSubAccountTeamMembers(subaccountId);
          if (response) setAllTeamMembers(response);
        } catch (error) {
          console.error("Failed to fetch team members:", error);
          toast.error("Could not load team members");
        }
      };
      fetchTeamMembers();
    }
  }, [subaccountId]);

  // Initialize form with ticket data
  useEffect(() => {
    if (currentTicket) {
      form.reset({
        name: currentTicket.name || "",
        description: currentTicket.description || "",
        value: String(currentTicket.value || 0),
      });

      if (currentTicket.customerId) {
        setContact(currentTicket.customerId);
      }

      // Fetch customer data if available
      const fetchCustomerData = async () => {
        if (currentTicket?.Customer?.name) {
          try {
            const response = await searchContacts(currentTicket.Customer.name);
            setContactList(response || []);
          } catch (error) {
            console.error("Failed to fetch customer data:", error);
          }
        }
      };

      fetchCustomerData();
    }
  }, [currentTicket, form]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(async () => {
        try {
          const response = await searchContacts(value);
          setContactList(response || []);
        } catch (error) {
          console.error("Error searching contacts:", error);
          toast.error("Failed to search contacts");
        }
      }, 500); // Reduced debounce time for better UX
    },
    []
  );

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) {
      toast.error("Lane ID is required");
      return;
    }

    try {
      const ticketPayload = {
        ...values,
        laneId,
        id: currentTicket?.id,
        assignedUserId: assignedTo || null,
        customerId: contact || null,
      };

      const response = await upsertTicket(ticketPayload, tags);

      if (response) {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `${currentTicket?.id ? "Updated" : "Created"} ticket | ${
            response.name
          }`,
          subaccountId,
        });

        toast.success(currentTicket?.id ? "Ticket updated" : "Ticket created");
        getNewTicket(response);
        router.refresh();
        setClose();
      }
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast.error("Could not save ticket details");
    }
  };

  const selectedCustomer = contactList.find((c) => c.id === contact);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{currentTicket?.id ? "Edit" : "Create"} Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter ticket name"
                      disabled={isFormLoading || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter ticket description"
                      disabled={isFormLoading || isSubmitting}
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter ticket value"
                      disabled={isFormLoading || isSubmitting}
                      type="number"
                      {...field}
                      onChange={(e) => {
                        // Only allow positive numbers
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <TagCreator
                subAccountId={subaccountId}
                getSelectedTags={setTags}
                defaultTags={currentTicket?.Tags || []}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Assigned Team Member</FormLabel>
              <Select onValueChange={setAssignedTo} value={assignedTo}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-sm text-white">
                            <User2 size={14} />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          Not Assigned
                        </span>
                      </div>
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {allTeamMembers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No team members available
                    </SelectItem>
                  ) : (
                    allTeamMembers.map((teamMember) => (
                      <SelectItem key={teamMember.id} value={teamMember.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              alt={teamMember.name || "Team member"}
                              src={teamMember.avatarUrl || undefined}
                            />
                            <AvatarFallback className="bg-primary text-sm text-white">
                              {teamMember.name?.slice(0, 2).toUpperCase() || (
                                <User2 size={14} />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{teamMember.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <FormLabel>Customer</FormLabel>
              <Popover>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between"
                    disabled={isFormLoading || isSubmitting}
                  >
                    {selectedCustomer
                      ? selectedCustomer.name
                      : "Select Customer..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search customers..."
                      className="h-9"
                      value={search}
                      onInput={handleSearchChange}
                    />
                    {contactList.length === 0 ? (
                      <CommandEmpty>
                        No customers found. Try a different search.
                      </CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {contactList.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={c.id}
                            onSelect={(currentValue) => {
                              setContact(
                                currentValue === contact ? "" : currentValue
                              );
                            }}
                          >
                            <div className="flex items-center">
                              <span>{c.name}</span>
                              {c.email && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({c.email})
                                </span>
                              )}
                            </div>
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                contact === c.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                className="w-24"
                disabled={isFormLoading || isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <Loading />
                ) : currentTicket?.id ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
