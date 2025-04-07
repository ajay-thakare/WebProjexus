import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const agencyId = await verifyAndAcceptInvitation();
  console.log(agencyId);

  // get user details
  const user = await getAuthUserDetails();

  // if not user then go to create an agency

  return <div>agency dashboard</div>;
};

export default page;
