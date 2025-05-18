"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { useModal } from "@/providers/modal-provider";
import { Plan } from "@prisma/client";
import { StripeElementsOptions } from "@stripe/stripe-js";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe/stripe-client";
import Loading from "@/components/global/loading";
import SubscriptionForm from ".";
import toast from "react-hot-toast";

type SubscriptionState = {
  subscriptionId: string;
  clientSecret: string;
};

type Props = {
  customerId: string;
  planExists: boolean;
};

const SubscriptionFormWrapper = ({ customerId, planExists }: Props) => {
  const { data, setClose } = useModal();
  const router = useRouter();
  const [selectedPriceId, setSelectedPriceId] = useState<Plan | "">(
    data?.plans?.defaultPriceId || ""
  );
  const [subscription, setSubscription] = useState<SubscriptionState>({
    subscriptionId: "",
    clientSecret: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          // Base colors - aligned with your Tailwind dark theme
          colorPrimary: "#0066ff",
          colorBackground: "#0B1229",
          colorText: "#f8fafc",
          colorDanger: "#e11d48",

          // Forms & UI
          colorTextPlaceholder: "#64748b",
          colorIconHover: "#cbd5e1",

          // Special effects
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",

          fontFamily: "Inter, system-ui, sans-serif",
          fontWeightNormal: "400",
          fontWeightBold: "600",

          borderRadius: "8px",
        },
        rules: {
          // Type-safe rules configuration
          ".Input": {
            backgroundColor: "#131A2B",
            color: "#f1f5f9",
            borderColor: "#1e293b",
          },
          ".Input:focus": {
            borderColor: "#0066ff",
            boxShadow: "0 0 0 1px rgba(0, 102, 255, 0.5)",
          },
          ".Label": {
            color: "#cbd5e1",
          },
          ".Error": {
            color: "#f87171",
          },
        },
      },
    }),
    [subscription?.clientSecret]
  );

  const createSubscriptionSecret = useCallback(async () => {
    if (!selectedPriceId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          priceId: selectedPriceId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create subscription");

      const { clientSecret, subscriptionId } = await response.json();
      setSubscription({ clientSecret, subscriptionId });

      if (planExists) {
        toast.success("Your plan has been successfully upgraded!");
        setClose();
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to process subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPriceId, customerId, planExists, setClose, router]);

  useEffect(() => {
    createSubscriptionSecret();
  }, [createSubscriptionSecret]);

  const handleCardClick = (priceId: Plan) => {
    if (priceId !== selectedPriceId) {
      setSelectedPriceId(priceId);
    }
  };

  const renderPriceCards = () =>
    data.plans?.plans.map((price) => {
      const pricingCardInfo = pricingCards.find((p) => p.priceId === price.id);
      return (
        <Card
          onClick={() => handleCardClick(price.id as Plan)}
          key={price.id}
          className={clsx(
            "relative cursor-pointer transition-all hover:border-primary/50",
            {
              "border-primary": selectedPriceId === price.id,
            }
          )}
        >
          <CardHeader>
            <CardTitle>
              ${price.unit_amount ? price.unit_amount / 100 : "0"}
              <p className="text-sm text-muted-foreground">{price.nickname}</p>
              <p className="text-sm text-muted-foreground">
                {pricingCardInfo?.description}
              </p>
            </CardTitle>
          </CardHeader>
          {selectedPriceId === price.id && (
            <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4" />
          )}
        </Card>
      );
    });

  const renderPaymentSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full h-40">
          <Loading />
        </div>
      );
    }

    if (options.clientSecret && !planExists) {
      return (
        <>
          <h1 className="text-xl">Payment Method</h1>
          <Elements stripe={getStripe()} options={options}>
            <SubscriptionForm selectedPriceId={selectedPriceId} />
          </Elements>
        </>
      );
    }

    return null;
  };

  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        {renderPriceCards()}
        {renderPaymentSection()}
      </div>
    </div>
  );
};

export default SubscriptionFormWrapper;
