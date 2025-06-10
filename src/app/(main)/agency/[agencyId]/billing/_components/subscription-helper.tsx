"use client";
import SubscriptionFormWrapper from "@/components/forms/subscription-form/subscription-form-wrapper";
import CustomModal from "@/components/global/custom-modal";
import { PricesList } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  prices: PricesList["data"];
  customerId: string;
  planExists: boolean;
};

const SubscriptionHelper = ({ prices, customerId, planExists }: Props) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan");
  const fromLanding = searchParams.get("from") === "landing";
  const isNewUser = !planExists;
  useEffect(() => {
    if (plan && (isNewUser || fromLanding)) {
      setOpen(
        <CustomModal
          title="Upgrade Plan!"
          subheading="Get started today to get access to premium features"
        >
          <SubscriptionFormWrapper
            planExists={planExists}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
          plans: {
            defaultPriceId: plan ? plan : "",
            plans: prices,
          },
        })
      );

      // Clean up URL parameters after showing modal to prevent re-triggering
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("plan");
      newSearchParams.delete("from");
      router.replace(
        `${window.location.pathname}?${newSearchParams.toString()}`,
        { scroll: false }
      );
    }
  }, [
    plan,
    isNewUser,
    fromLanding,
    planExists,
    customerId,
    prices,
    setOpen,
    router,
    searchParams,
  ]);

  return null;
};

export default SubscriptionHelper;
