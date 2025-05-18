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
      include: { SubAccount: true },
    });

    if (!agency) {
      throw new Error(`No agency found with customer ID: ${customerId}`);
    }

    const periodEnd = (
      subscription as unknown as { current_period_end: number }
    ).current_period_end;

    // Get price from the first subscription item
    const priceId = subscription.items.data[0]?.price.id;

    if (!priceId) {
      throw new Error("No price ID found in subscription");
    }

    let planValue: Plan | null = null;

    // Convert string to Plan enum if it's a valid value
    if (priceId === "price_1RP9DEIWAL1xSlzJZpCMx1vL") {
      planValue = Plan.price_1RP9DEIWAL1xSlzJZpCMx1vL;
    } else if (priceId === "price_1RP9DEIWAL1xSlzJrZqMg5gr") {
      planValue = Plan.price_1RP9DEIWAL1xSlzJrZqMg5gr;
    }

    const subscriptionData = {
      active: subscription.status === "active",
      agencyId: agency.id,
      customerId,
      currentPeriodEndDate: new Date(periodEnd * 1000),
      priceId,
      subscriptionId: subscription.id,
      plan: planValue,
    };

    await db.subscription.upsert({
      where: { agencyId: agency.id },
      create: subscriptionData,
      update: subscriptionData,
    });

    console.log(
      `✅ Successfully created/updated subscription: ${subscription.id}`
    );
  } catch (error) {
    console.error(
      "❌ Error in subscriptionCreated:",
      error instanceof Error ? error.message : "Unknown error"
    );
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
