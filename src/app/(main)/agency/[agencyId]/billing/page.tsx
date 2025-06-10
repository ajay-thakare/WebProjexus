import { Separator } from "@/components/ui/separator";
import { addOnProducts, pricingCards } from "@/lib/constants";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import React from "react";
import PricingCard from "./_components/pricing-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { CreditCard } from "lucide-react";
import SubscriptionHelper from "./_components/subscription-helper";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

interface PaymentHistoryItem {
  description: string;
  id: string;
  date: string;
  time: string;
  status: PaymentStatus;
  amount: string;
}

type Props = {
  params: Promise<{ agencyId: string }>;
};

const page = async ({ params }: Props) => {
  const { agencyId } = await params;

  try {
    // query to get all subscription data
    const agency = await db.agency.findUnique({
      where: { id: agencyId },
      include: {
        Subscription: true,
      },
    });

    // fetching price info of Priority Support
    const addOns = await stripe.products.list({
      ids: addOnProducts.map((product) => product.id),
      expand: ["data.default_price"],
    });

    const prices = await stripe.prices.list({
      product: process.env.NEXT_WEBPRO_PRODUCT_ID,
      active: true,
    });

    // Check subscription status
    const subscription = agency?.Subscription;
    const isSubscriptionActive = subscription?.active === true;
    const currentPlan = subscription?.plan;
    const currentPriceId = subscription?.priceId;

    // Find current plan details
    let currentPlanDetails = pricingCards.find(
      (c) => c.priceId === currentPlan || c.priceId === currentPriceId
    );

    // If no plan details found but subscription is active, try to get from Stripe
    if (!currentPlanDetails && isSubscriptionActive && currentPriceId) {
      try {
        const stripePrice = await stripe.prices.retrieve(currentPriceId);
        const stripeProduct = await stripe.products.retrieve(
          stripePrice.product as string
        );

        currentPlanDetails = {
          title: stripeProduct.name || "Current Plan",
          description:
            stripeProduct.description || "Your current subscription plan",
          price: `$${(stripePrice.unit_amount || 0) / 100}`,
          duration: "/month",
          highlight: "Current Plan",
          priceId: currentPriceId,
          features: [],
        };
      } catch (error) {
        console.error("Error fetching plan from Stripe:", error);
      }
    }

    // Fallback to Starter plan
    if (!currentPlanDetails) {
      currentPlanDetails = pricingCards.find(
        (pricing) => pricing.title === "Starter"
      ) || {
        title: "Starter",
        description: "Perfect for trying out our service",
        price: "Free",
        duration: "",
        highlight: "Get Started",
        priceId: "",
        features: ["3 Sub accounts", "2 Team members", "Unlimited pipelines"],
      };
    }

    // Get payment history with separated date and time
    let paymentHistory: PaymentHistoryItem[] = [];
    if (agency?.customerId) {
      try {
        const charges = await stripe.charges.list({
          limit: 50,
          customer: agency.customerId,
        });

        paymentHistory = charges.data.map((charge) => {
          const paymentDate = new Date(charge.created * 1000);

          return {
            description: charge.description || "Subscription Payment",
            id: charge.id,
            date: paymentDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            time: paymentDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            status: "Paid" as PaymentStatus,
            amount: `$${(charge.amount / 100).toFixed(2)}`,
          };
        });
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    }

    return (
      <>
        <SubscriptionHelper
          prices={prices.data}
          customerId={agency?.customerId || ""}
          planExists={agency?.Subscription?.active === true}
        />
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b border-border/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Billing & Subscription
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your subscription and view payment history
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator className="mb-1" />
        <h2 className="text-2xl p-4">Current Plan</h2>
        <div className="flex flex-col lg:!flex-row justify-between gap-8">
          <PricingCard
            planExists={isSubscriptionActive}
            prices={prices.data}
            customerId={agency?.customerId || ""}
            amt={isSubscriptionActive ? currentPlanDetails.price : "Free"}
            buttonCta={isSubscriptionActive ? "Change Plan" : "Get Started"}
            highlightDescription="Want to modify your plan? You can do this here. If you have further questions contact support@webpro-app.com"
            highlightTitle="Plan Options"
            description={
              isSubscriptionActive
                ? currentPlanDetails.description
                : "Let's get started! Pick a plan that works best for you."
            }
            duration={currentPlanDetails.duration}
            features={currentPlanDetails.features}
            title={currentPlanDetails.title}
          />

          {addOns.data.map((addOn) => (
            <PricingCard
              planExists={isSubscriptionActive}
              prices={prices.data}
              customerId={agency?.customerId || ""}
              key={addOn.id}
              amt={
                //@ts-ignore
                addOn.default_price?.unit_amount
                  ? //@ts-ignore
                    `$${addOn.default_price.unit_amount / 100}`
                  : "$0"
              }
              buttonCta="Subscribe"
              description="Dedicated support line & teams channel for support"
              duration="/month"
              features={[]}
              title={"24/7 priority support"}
              highlightTitle="Get support now!"
              highlightDescription="Get priority support and skip the long queue with the click of a button."
            />
          ))}
        </div>
        <Separator className="mb-1" />

        <h2 className="text-2xl p-4">Payment History</h2>
        <Table className="bg-card border-[1px] border-border rounded-md">
          <TableHeader className="rounded-md">
            <TableRow>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead className="w-[300px]">Invoice Id</TableHead>
              <TableHead className="w-[200px]">Date</TableHead>
              <TableHead className="w-[200px]">Time</TableHead>
              <TableHead className="w-[200px]">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-medium truncate">
            {paymentHistory.length > 0 ? (
              paymentHistory.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell>{charge.description}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {charge.id}
                  </TableCell>
                  <TableCell className="text-sm">{charge.date}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {charge.time}
                  </TableCell>
                  <TableCell>
                    <p
                      className={clsx("", {
                        "text-emerald-500":
                          charge.status.toLowerCase() === "paid",
                        "text-orange-600":
                          charge.status.toLowerCase() === "pending",
                        "text-red-600":
                          charge.status.toLowerCase() === "failed",
                      })}
                    >
                      {charge.status.toUpperCase()}
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {charge.amount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No payment history found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>
    );
  } catch (error) {
    console.error("Error loading billing page:", error);
    return (
      <div className="p-4">
        <h1 className="text-4xl">Billing</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          Error loading billing information. Please try again later.
        </div>
      </div>
    );
  }
};

export default page;
