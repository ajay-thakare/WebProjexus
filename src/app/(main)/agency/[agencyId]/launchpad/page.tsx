import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MobileShortcutGuide from "@/components/zextra/mobile-shortcut-guide";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getStripeOAuthLink } from "@/lib/utils";
import { CheckCircleIcon, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: Promise<{
    agencyId: string;
  }>;
  searchParams: Promise<{ code: string }>;
};

const LaunchPadPage = async ({ params, searchParams }: Props) => {
  const [{ agencyId }, { code }] = await Promise.all([params, searchParams]);

  const agencyDetails = await db.agency.findUnique({
    where: { id: agencyId },
  });

  if (!agencyDetails) return;

  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const stripeOAuthLink = getStripeOAuthLink(
    "agency",
    `launchpad___${agencyDetails.id}`
  );

  let connectedStripeAccount = false;
  if (code) {
    if (!agencyDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: "authorization_code",
          code,
        });

        await db.agency.update({
          where: { id: agencyId },
          data: { connectAccountId: response.stripe_user_id },
        });
        connectedStripeAccount = true;
      } catch (error) {
        console.error("🔴 Could not connect stripe account", error);
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started</CardTitle>
            <CardDescription>
              Follow the steps below to get your account setup
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                <Image
                  src="/appstore.png"
                  alt="app logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>Save the website as a shortcut on your mobile device</p>
              </div>
              <MobileShortcutGuide />
            </div>
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                <Image
                  src="/stripelogo.png"
                  alt="stripe logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>
                  Connect your stripe account to accept payments and see your
                  dashboard.
                </p>
              </div>
              {agencyDetails.connectAccountId || connectedStripeAccount ? (
                <CheckCircleIcon
                  size={50}
                  className=" text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className="bg-primary py-2 px-4 rounded-md text-white"
                  href={stripeOAuthLink}
                >
                  Start
                </Link>
              )}
            </div>
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                {agencyDetails.agencyLogo ? (
                  <Image
                    src={agencyDetails.agencyLogo}
                    alt="agency logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                ) : (
                  <div className="w-[80px] h-[60px] bg-gray-100 rounded-md flex items-center justify-center border text-xl font-semibold text-gray-600">
                    {getInitials(agencyDetails.name || "A")}
                  </div>
                )}

                <p>Fill in all your business details</p>
              </div>
              {allDetailsExist ? (
                <CheckCircleIcon
                  size={50}
                  className="text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className="bg-primary py-2 px-4 rounded-md text-white"
                  href={`/agency/${agencyId}/settings`}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaunchPadPage;
