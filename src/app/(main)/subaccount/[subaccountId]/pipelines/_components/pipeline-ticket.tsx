"use client";
import TicketForm from "@/components/forms/ticket-form";
import CustomModal from "@/components/global/custom-modal";
import TagComponent from "@/components/global/tag";
import LinkIcon from "@/components/icons/link";
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { deleteTicket, saveActivityLogsNotification } from "@/lib/queries";
import { TicketWithTags } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { Contact2, Edit, MoreHorizontal, Trash, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

type Props = {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>;
  ticket: TicketWithTags[0];
  subaccountId: string;
  allTickets: TicketWithTags;
  index: number;
};

const PipelineTicket = ({
  setAllTickets,
  ticket,
  subaccountId,
  index,
}: Props) => {
  const router = useRouter();
  const { setOpen } = useModal();

  const editNewTicket = useCallback(
    (updatedTicket: TicketWithTags[0]) => {
      setAllTickets((tickets) =>
        tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
    },
    [setAllTickets]
  );

  const handleClickEdit = useCallback(() => {
    setOpen(
      <CustomModal title="Update Ticket Details" subheading="">
        <TicketForm
          getNewTicket={editNewTicket}
          laneId={ticket.laneId}
          subaccountId={subaccountId}
          defaultData={ticket}
        />
      </CustomModal>,
      async () => {
        return { ticket };
      }
    );
  }, [editNewTicket, setOpen, subaccountId, ticket]);

  const handleDeleteTicket = useCallback(async () => {
    try {
      setAllTickets((tickets) => tickets.filter((t) => t.id !== ticket.id));
      const response = await deleteTicket(ticket.id);
      toast.success("Deleted ticket from lane", { duration: 4000 });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a ticket | ${response?.name}`,
        subaccountId,
      });

      router.refresh();
    } catch (error) {
      toast.error("Couldn't delete the ticket");
      console.error(error);
      // Restore ticket on error
      setAllTickets((tickets) => {
        if (!tickets.some((t) => t.id === ticket.id)) {
          return [...tickets, ticket];
        }
        return tickets;
      });
    }
  }, [router, setAllTickets, subaccountId, ticket]);

  const formattedDate = React.useMemo(() => {
    return new Date().toLocaleDateString();
  }, []);

  const ticketValue = React.useMemo(() => {
    if (!ticket.value) return null;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(+ticket.value);
  }, [ticket.value]);

  return (
    <Draggable draggableId={ticket.id.toString()} index={index}>
      {(provided, snapshot) => {
        const style = {
          ...provided.draggableProps.style,
        } as React.CSSProperties;
        if (snapshot.isDragging && style) {
          const offset = { x: 300, y: 20 };
          if (typeof style.top === "number") {
            style.top = style.top - offset.y;
          }
          if (typeof style.left === "number") {
            style.left = style.left - offset.x;
          }
        }

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
          >
            <AlertDialog>
              <DropdownMenu>
                <Card className="my-4 dark:bg-slate-900 bg-white shadow-none transition-all">
                  <CardHeader className="p-3">
                    <CardTitle className="flex items-center justify-between">
                      <span
                        className="text-lg w-full truncate"
                        title={ticket.name}
                      >
                        {ticket.name}
                      </span>
                      <DropdownMenuTrigger asChild>
                        <button
                          aria-label="More options"
                          className="focus:outline-none"
                        >
                          <MoreHorizontal className="text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                    </CardTitle>
                    <span className="text-muted-foreground text-xs">
                      {formattedDate}
                    </span>
                    {ticket.Tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-2 mt-2">
                        {ticket.Tags.map((tag) => (
                          <TagComponent
                            key={tag.id}
                            title={tag.name}
                            colorName={tag.color}
                          />
                        ))}
                      </div>
                    )}
                    {ticket.description && (
                      <CardDescription className="w-full mt-2">
                        {ticket.description}
                      </CardDescription>
                    )}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center mt-2">
                          <LinkIcon />
                          <span className="text-xs font-bold">CONTACT</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="w-fit">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage
                              alt={ticket.Customer?.name || "Customer"}
                            />
                            <AvatarFallback className="bg-primary">
                              {ticket.Customer?.name
                                ?.slice(0, 2)
                                .toUpperCase() ?? "NA"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {ticket.Customer?.name ?? "Unknown"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {ticket.Customer?.email ?? "No email"}
                            </p>
                            <div className="flex items-center pt-2">
                              <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-xs text-muted-foreground">
                                Joined{" "}
                                {ticket.Customer?.createdAt
                                  ? new Date(
                                      ticket.Customer.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </CardHeader>

                  <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          alt={ticket.Assigned?.name || "Assigned user"}
                          src={ticket.Assigned?.avatarUrl}
                        />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          {ticket.Assigned?.name?.slice(0, 2).toUpperCase() || (
                            <User2 size={14} />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col justify-center">
                        <span className="text-sm text-muted-foreground">
                          {ticket.assignedUserId
                            ? "Assigned to"
                            : "Not Assigned"}
                        </span>
                        {ticket.assignedUserId && (
                          <span
                            className="text-xs max-w-28 truncate text-muted-foreground"
                            title={ticket.Assigned?.name}
                          >
                            {ticket.Assigned?.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {ticketValue && (
                      <span className="text-sm font-bold">{ticketValue}</span>
                    )}
                  </CardFooter>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600 focus:text-red-600"
                        aria-label="Delete ticket"
                      >
                        <Trash size={15} />
                        Delete Ticket
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleClickEdit}
                      aria-label="Edit ticket"
                    >
                      <Edit size={15} />
                      Edit Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </Card>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the ticket and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteTicket}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineTicket;
