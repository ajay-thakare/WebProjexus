"use client";
import SubscriptionFormWrapper from "@/components/forms/subscription-form/subscription-form-wrapper";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PricesList } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useSearchParams } from "next/navigation";
import React from "react";
import { CheckCircle2, Star, Sparkles } from "lucide-react";

type Props = {
  amt: string;
  buttonCta: string;
  customerId: string;
  description: string;
  duration: string;
  title: string;
  features: string[];
  planExists: boolean;
  highlightTitle: string;
  prices: PricesList["data"];
  highlightDescription: string;
};

const PricingCard = ({
  amt,
  buttonCta,
  customerId,
  description,
  duration,
  title,
  features,
  planExists,
  highlightTitle,
  prices,
  highlightDescription,
}: Props) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const handleManagePlan = async () => {
    setOpen(
      <CustomModal
        title={"Manage Your Plan"}
        subheading="You can change your plan at any time from the billings settings"
      >
        <SubscriptionFormWrapper
          customerId={customerId}
          planExists={planExists}
        />
      </CustomModal>,
      async () => ({
        plans: {
          defaultPriceId: plan ? plan : "",
          plans: prices,
        },
      })
    );
  };

  // Determine if this is the current active plan
  const isCurrentPlan = planExists && buttonCta === "Change Plan";
  const isPopularPlan =
    title.toLowerCase().includes("unlimited") ||
    title.toLowerCase().includes("pro");

  return (
    <Card
      className={`
        relative flex flex-col justify-between lg:w-1/2 h-full
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${
          isCurrentPlan
            ? "border-primary/50 shadow-lg ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-accent/5"
            : "border-border hover:border-primary/30"
        }
        ${
          isPopularPlan && !isCurrentPlan
            ? "border-orange-200 shadow-md ring-1 ring-orange-100"
            : ""
        }
      `}
    >
      {/* Popular Badge */}
      {isPopularPlan && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <CheckCircle2 className="w-3 h-3 fill-current" />
            Current Plan
          </div>
        </div>
      )}

      <div className="flex-1">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                {title}
                {title.toLowerCase().includes("24/7") && (
                  <Sparkles className="w-4 h-4 text-primary" />
                )}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </CardDescription>
            </div>

            <div className="text-right">
              <div className="flex items-baseline justify-end">
                <span className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  {amt}
                </span>
                {duration && (
                  <span className="text-sm font-medium text-muted-foreground ml-1">
                    {duration}
                  </span>
                )}
              </div>
              {amt === "Free" && (
                <p className="text-xs text-muted-foreground mt-1">
                  No credit card required
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          {features.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-foreground mb-3">
                What's included:
              </h4>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="pt-0">
        <Card
          className={`
          w-full border-0 shadow-sm
          ${
            isCurrentPlan
              ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
              : "bg-gradient-to-r from-muted/50 to-accent/20"
          }
        `}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg">
            <div className="space-y-1">
              <p className="font-semibold text-foreground text-sm">
                {highlightTitle}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {highlightDescription}
              </p>
            </div>

            <Button
              className={`
                md:w-fit w-full font-semibold transition-all duration-200
                ${
                  isCurrentPlan
                    ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl"
                    : buttonCta === "Subscribe"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl"
                }
              `}
              onClick={handleManagePlan}
            >
              {buttonCta}
            </Button>
          </div>
        </Card>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
