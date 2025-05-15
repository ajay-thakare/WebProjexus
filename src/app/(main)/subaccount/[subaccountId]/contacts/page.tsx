import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { Contact, SubAccount, Ticket } from "@prisma/client";
import { format } from "date-fns";
import React from "react";
import CreateContactBtn from "./_components/create-contact-btn";
import ContactActions from "./_components/contact-actions";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const ContactPage = async ({ params }: Props) => {
  const { subaccountId } = await params;

  type SubAccountWithContacts = SubAccount & {
    Contact: (Contact & { Ticket: Ticket[] })[];
  };

  const contacts = (await db.subAccount.findUnique({
    where: { id: subaccountId },
    include: {
      Contact: {
        include: {
          Ticket: {
            select: {
              value: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })) as SubAccountWithContacts;

  const allContacts = contacts.Contact;

  const formatTotal = (tickets: Ticket[]) => {
    if (!tickets?.length) return "$0.00";

    const amt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    });

    const laneAmt = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0
    );

    return amt.format(laneAmt);
  };

  return (
    <div className="px-4 md:px-8 space-y-6 mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl md:text-4xl font-bold">Contacts</h1>
        <CreateContactBtn subaccountId={subaccountId} />
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="rounded-md border shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[200px] hidden lg:table-cell">
                Email
              </TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="hidden lg:table-cell">
                Created Date
              </TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="font-medium truncate">
            {allContacts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No contacts found. Create your first contact to get started.
                </TableCell>
              </TableRow>
            ) : (
              allContacts.map((contact) => {
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  contact.name
                )}&background=4f46e5&color=fff&rounded=true&size=128`;

                const isActive = formatTotal(contact.Ticket) !== "$0.00";

                return (
                  <TableRow key={contact.id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          alt={contact.name}
                          src={avatarUrl}
                          className="h-10 w-10 border-2 shadow-sm hover:shadow-md transition-all"
                        />
                        <AvatarFallback className="bg-primary text-white">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{contact.name}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {contact.email}
                    </TableCell>
                    <TableCell>
                      {!isActive ? (
                        <Badge variant={"destructive"}>Inactive</Badge>
                      ) : (
                        <Badge className="bg-emerald-700">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(contact.createdAt, "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatTotal(contact.Ticket)}
                    </TableCell>
                    <TableCell>
                      <ContactActions
                        contactId={contact.id}
                        contactName={contact.name}
                        contactEmail={contact.email}
                        subaccountId={subaccountId}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile and Tablet Card View - Shown only on small screens */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {allContacts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No contacts found. Create your first contact to get started.
            </CardContent>
          </Card>
        ) : (
          allContacts.map((contact) => {
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              contact.name
            )}&background=4f46e5&color=fff&rounded=true&size=128`;

            const isActive = formatTotal(contact.Ticket) !== "$0.00";

            return (
              <Card key={contact.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          alt={contact.name}
                          src={avatarUrl}
                          className="h-10 w-10 border-2 shadow-sm"
                        />
                        <AvatarFallback className="bg-primary text-white">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <ContactActions
                      contactId={contact.id}
                      contactName={contact.name}
                      contactEmail={contact.email}
                      subaccountId={subaccountId}
                    />
                  </div>
                  <div className="grid grid-cols-2 p-4 gap-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      {!isActive ? (
                        <Badge variant={"destructive"} className="mt-1">
                          Inactive
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-700 mt-1">Active</Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Value
                      </p>
                      <p className="font-medium">
                        {formatTotal(contact.Ticket)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {format(contact.createdAt, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContactPage;
