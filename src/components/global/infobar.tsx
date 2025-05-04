"use client";
import { NotificationWithUser } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Bell } from "lucide-react";
import { Role } from "@prisma/client";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "./mode-toggle";

type Props = {
  notifications: NotificationWithUser | [];
  role?: Role;
  className?: string;
  subAccountId?: string;
};

const InfoBar = ({ notifications, role, className, subAccountId }: Props) => {
  const [showAll, setShowAll] = useState(false);

  const filteredNotifications = useMemo(() => {
    if (!showAll || !subAccountId) return notifications;
    return notifications?.filter((item) => item.subAccountId === subAccountId);
  }, [notifications, showAll, subAccountId]);

  useEffect(() => {
    setShowAll(false);
  }, [notifications, subAccountId]);

  const handleSwitch = () => {
    setShowAll((prev) => !prev);
  };
  return (
    <>
      <div
        className={twMerge(
          "fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]",
          className
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
          <UserButton />
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white">
                <Bell size={17} />
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 flex flex-col max-h-screen overflow-hidden">
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  Manage your notification settings
                </SheetDescription>
              </SheetHeader>

              {(role === "AGENCY_ADMIN" || role === "AGENCY_OWNER") && (
                <Card className="flex items-center justify-between p-4 mb-1 mt-0.5">
                  Current Subaccount
                  <Switch checked={showAll} onCheckedChange={handleSwitch} />
                </Card>
              )}

              <div className="flex-1 overflow-y-auto pr-2 mt-2">
                {filteredNotifications?.length === 0 ? (
                  <div className="flex items-center justify-center text-muted-foreground h-full">
                    You have no Notifications
                  </div>
                ) : (
                  filteredNotifications?.map((notification) => (
                    <Card
                      key={notification.id}
                      className="flex flex-col gap-y-2 mb-1 p-3"
                    >
                      <div className="flex gap-2 items-start">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={notification.User.avatarUrl}
                            alt="Profile Picture"
                          />
                          <AvatarFallback className="bg-primary">
                            {notification.User.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p>
                            <span className="font-bold">
                              {notification.notification.split("|")[0]}
                            </span>
                            <span className="text-muted-foreground">
                              {notification.notification.split("|")[1]}
                            </span>
                            <span className="font-bold">
                              {notification.notification.split("|")[2]}
                            </span>
                          </p>
                          <small className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Kolkata",
                              }
                            )}
                          </small>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default InfoBar;
