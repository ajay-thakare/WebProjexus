import AgencyDetails from "@/components/forms/agency-details";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  const { plan, state, code } = await Promise.resolve(searchParams);

  const agencyId = await verifyAndAcceptInvitation();
  console.log(agencyId);

  // get user details
  const user = await getAuthUserDetails();

  // Todo - implement subaccount_guest functionality
  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${plan}`);
      }
      if (state) {
        const statePath = state.split("___")[0];
        const stateAgencyId = state.split("___")[1];
        if (!stateAgencyId) return <div>Not Authorized</div>;

        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${code}`);
      } else return redirect(`/agency/${agencyId}`);
    } else {
      return <div>Not Authorized</div>;
    }
  }

  const authUser = await currentUser();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl"> Create an Agency</h1>
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default page;
