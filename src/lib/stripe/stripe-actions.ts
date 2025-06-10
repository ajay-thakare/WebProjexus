"use server";
import Stripe from "stripe";
import { db } from "../db";
import { stripe } from ".";
import { Plan } from "@prisma/client";

export const subscriptionCreated = async (
  subscription: Stripe.Subscription,
  customerId: string
): Promise<void> => {
  try {
    const agency = await db.agency.findFirst({
      where: { customerId },
      include: { SubAccount: true, Subscription: true },
    });

    if (!agency) {
      throw new Error(`No agency found with customer ID: ${customerId}`);
    }

    // Check if we need to fetch complete subscription data
    let subscriptionData: any = subscription;

    if (!subscriptionData["current_period_end"]) {
      const stripeResponse = await stripe.subscriptions.retrieve(
        subscription.id
      );
      subscriptionData = stripeResponse;
    }

    // Get the period end date
    const periodEnd = subscriptionData["current_period_end"];

    // Get price from the first subscription item
    const priceId = subscriptionData.items?.data?.[0]?.price?.id;
    const priceAmount = subscriptionData.items?.data?.[0]?.price?.unit_amount;

    if (!priceId) {
      throw new Error("No price ID found in subscription");
    }

    if (!periodEnd || typeof periodEnd !== "number") {
      console.error("🔴 Invalid or missing current_period_end:", periodEnd);
      // Create a fallback date (30 days from now)
      const fallbackPeriodEnd =
        Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      const dbSubscriptionData = {
        active: subscriptionData.status === "active",
        agencyId: agency.id,
        customerId,
        currentPeriodEndDate: new Date(fallbackPeriodEnd * 1000),
        priceId,
        subscriptionId: subscriptionData.id,
        plan: priceId as Plan,
        price: priceAmount?.toString() || "0",
      };

      const result = await db.subscription.upsert({
        where: { agencyId: agency.id },
        create: dbSubscriptionData,
        update: dbSubscriptionData,
      });

      console.log(
        "✅ Successfully created/updated subscription with fallback date:",
        {
          id: result.id,
          subscriptionId: result.subscriptionId,
          agencyId: result.agencyId,
          active: result.active,
          plan: result.plan,
        }
      );

      return;
    }

    let planValue: Plan | null = null;

    // Convert string to Plan enum if it's a valid value
    if (priceId === "price_1RP9DEIWAL1xSlzJZpCMx1vL") {
      planValue = Plan.price_1RP9DEIWAL1xSlzJZpCMx1vL;
    } else if (priceId === "price_1RP9DEIWAL1xSlzJrZqMg5gr") {
      planValue = Plan.price_1RP9DEIWAL1xSlzJrZqMg5gr;
    } else {
      console.error("🔴 Unknown price ID:", priceId);
      throw new Error(`Unknown price ID: ${priceId}`);
    }

    // Validate the date before creating the subscription data
    const currentPeriodEndDate = new Date(periodEnd * 1000);
    if (isNaN(currentPeriodEndDate.getTime())) {
      console.error("🔴 Invalid date created from periodEnd:", periodEnd);
      throw new Error(`Invalid date from periodEnd: ${periodEnd}`);
    }

    // Determine if subscription should be marked as active
    const isActive = subscriptionData.status === "active";

    const dbSubscriptionData = {
      active: isActive,
      agencyId: agency.id,
      customerId,
      currentPeriodEndDate,
      priceId,
      subscriptionId: subscriptionData.id,
      plan: planValue,
      price: priceAmount?.toString() || "0",
    };

    const result = await db.subscription.upsert({
      where: { agencyId: agency.id },
      create: dbSubscriptionData,
      update: dbSubscriptionData,
    });

    console.log("✅ Successfully created/updated subscription:", {
      id: result.id,
      subscriptionId: result.subscriptionId,
      agencyId: result.agencyId,
      active: result.active,
      plan: result.plan,
      status: subscriptionData.status,
    });
  } catch (error) {
    console.error("🔴 Error in subscriptionCreated:", error);
    console.error("🔴 Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      subscriptionId: subscription.id,
      customerId,
    });
    throw error;
  }
};

export const getConnectAccountProducts = async (
  stripeAccount: string
): Promise<Stripe.Product[]> => {
  try {
    const products = await stripe.products.list(
      {
        limit: 50,
        expand: ["data.default_price"],
        active: true,
      },
      { stripeAccount }
    );

    return products.data;
  } catch (error) {
    console.error(
      "❌ Error fetching connected account products:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
};
