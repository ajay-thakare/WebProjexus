import { stripe } from "@/lib/stripe";
import { subscriptionCreated } from "@/lib/stripe/stripe-actions";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const platformWebhookEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "account.updated",
  "account.application.deauthorized",
]);

export async function POST(req: NextRequest) {
  let stripeEvent: Stripe.Event;
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  const webhookSecret =
    process.env.STRIPE_PLATFORM_WEBHOOK_SECRET_LIVE ??
    process.env.STRIPE_PLATFORM_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("🔴 Missing Stripe signature or webhook secret for platform");
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
    console.error(`Platform webhook validation error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (platformWebhookEvents.has(stripeEvent.type)) {
      switch (stripeEvent.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = stripeEvent.data.object as Stripe.Subscription;

          // Only handle platform subscriptions (no connected account metadata)
          if (
            !subscription.metadata.connectAccountPayments &&
            !subscription.metadata.connectAccountSubscriptions
          ) {
            if (subscription.status === "active") {
              await subscriptionCreated(
                subscription,
                subscription.customer as string
              );
              console.log(
                "✅ PLATFORM SUBSCRIPTION CREATED 💳",
                subscription.id
              );
            } else {
              console.log(
                "⏭️ SKIPPED - Platform subscription not active",
                subscription.status
              );
            }
          } else {
            console.log(
              "⏭️ SKIPPED - Connected account subscription in platform webhook"
            );
          }
          break;
        }

        case "account.updated": {
          const account = stripeEvent.data.object as Stripe.Account;
          console.log("📊 Connected account updated:", account.id);
          // You can add logic here to update your database with account changes
          break;
        }

        case "checkout.session.completed": {
          const session = stripeEvent.data.object as Stripe.Checkout.Session;
          // Only handle platform checkouts (no connected account)
          if (!stripeEvent.account) {
            console.log("✅ Platform checkout completed:", session.id);
            // Handle platform checkout completion if needed
          }
          break;
        }

        default:
          console.log("👉🏻 Unhandled platform event:", stripeEvent.type);
      }
    }
  } catch (error) {
    console.error("🔴 Platform webhook error:", error);
    return new NextResponse("Platform Webhook Error", { status: 400 });
  }

  return NextResponse.json(
    { webhookActionReceived: true, type: "platform" },
    { status: 200 }
  );
}
