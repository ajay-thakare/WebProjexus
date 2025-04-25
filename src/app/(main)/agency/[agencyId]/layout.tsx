import Unauthorized from "@/components/unauthorized";
import Sidebar from "@/components/sidebar";
import BlurPage from "@/components/global/blur-page";
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import InfoBar from "@/components/global/infobar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ agencyId: string }>;
};

const layout = async ({ children, params }: Props) => {
  const { agencyId: routeAgencyId } = await params;

  const agencyId = await verifyAndAcceptInvitation();

  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/agency");
  }

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  ) {
    return <Unauthorized />;
  }

  let allNotification: any = [];
  const notification = await getNotificationAndUser(agencyId);
  if (notification) allNotification = notification;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={routeAgencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={allNotification}
          role={allNotification.User?.role}
          // chk here role
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default layout;
