import { stripe } from "@/lib/stripe";
import { subscriptionCreated } from "@/lib/stripe/stripe-actions";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeWebhookEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
  let stripeEvent: Stripe.Event;
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("🔴 Missing Stripe signature or webhook secret");
    return new NextResponse("Webhook Error: Missing signature or secret", {
      status: 400,
    });
  }

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: any) {
    console.error(`Stripe webhook validation error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  //
  try {
    if (stripeWebhookEvents.has(stripeEvent.type)) {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      if (
        !subscription.metadata.connectAccountPayments &&
        !subscription.metadata.connectAccountSubscriptions
      ) {
        switch (stripeEvent.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            if (subscription.status === "active") {
              await subscriptionCreated(
                subscription,
                subscription.customer as string
              );
              console.log("CREATED FROM WEBHOOK 💳", subscription);
            } else {
              console.log(
                "SKIPPED AT CREATED FROM WEBHOOK 💳 because subscription status is not active",
                subscription
              );
              break;
            }
          }
          default:
            console.log("👉🏻 Unhandled relevant event!", stripeEvent.type);
        }
      } else {
        console.log(
          "SKIPPED FROM WEBHOOK 💳 because subscription was from a connected account not for the application",
          subscription
        );
      }
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("🔴 Webhook Error", { status: 400 });
  }
  return NextResponse.json(
    {
      webhookActionReceived: true,
    },
    {
      status: 200,
    }
  );
}
