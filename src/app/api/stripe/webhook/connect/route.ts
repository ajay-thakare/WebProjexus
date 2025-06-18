import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const connectWebhookEvents = new Set([
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
  "charge.dispute.created",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "checkout.session.completed",
]);

export async function POST(req: NextRequest) {
  let stripeEvent: Stripe.Event;
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  const connectedAccountId = (await headers()).get("Stripe-Account");

  const webhookSecret =
    process.env.STRIPE_CONNECT_WEBHOOK_SECRET_LIVE ??
    process.env.STRIPE_CONNECT_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("🔴 Missing Stripe signature or webhook secret for connect");
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
    console.error(`Connect webhook validation error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (connectWebhookEvents.has(stripeEvent.type)) {
      switch (stripeEvent.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
          console.log("✅ CONNECTED ACCOUNT PAYMENT SUCCESS 💰", {
            paymentIntentId: paymentIntent.id,
            connectedAccountId,
            amount: paymentIntent.amount,
          });

          // You can add logic here to update your database
          // For example, mark an order as paid, update pipeline stages, etc.
          if (connectedAccountId) {
            // Find the subaccount
            const subAccount = await db.subAccount.findFirst({
              where: { connectAccountId: connectedAccountId },
            });

            if (subAccount) {
              console.log("💡 Payment for subaccount:", subAccount.name);
              // Add any business logic here
            }
          }
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = stripeEvent.data.object as Stripe.Subscription;
          console.log("✅ CONNECTED ACCOUNT SUBSCRIPTION 📋", {
            subscriptionId: subscription.id,
            connectedAccountId,
            status: subscription.status,
          });

          // Handle connected account subscriptions differently from platform subscriptions
          // You might want to track these separately or update different database tables
          break;
        }

        case "checkout.session.completed": {
          const session = stripeEvent.data.object as Stripe.Checkout.Session;
          console.log("✅ CONNECTED ACCOUNT CHECKOUT 🛒", {
            sessionId: session.id,
            connectedAccountId,
            amount: session.amount_total,
          });

          // This is where you'd handle successful purchases for connected accounts
          // Update pipeline stages, send notifications, etc.
          break;
        }

        case "charge.dispute.created": {
          const dispute = stripeEvent.data.object as Stripe.Dispute;
          console.log("⚠️ DISPUTE CREATED 🚨", {
            disputeId: dispute.id,
            connectedAccountId,
            amount: dispute.amount,
          });

          // Handle disputes - notify the subaccount, update records, etc.
          if (connectedAccountId) {
            const subAccount = await db.subAccount.findFirst({
              where: { connectAccountId: connectedAccountId },
            });

            if (subAccount) {
              console.log("🚨 Dispute for subaccount:", subAccount.name);
              // Add dispute handling logic
            }
          }
          break;
        }

        default:
          console.log("👉🏻 Unhandled connect event:", stripeEvent.type);
      }
    }
  } catch (error) {
    console.error("🔴 Connect webhook error:", error);
    return new NextResponse("Connect Webhook Error", { status: 400 });
  }

  return NextResponse.json(
    {
      webhookActionReceived: true,
      type: "connect",
      connectedAccountId,
    },
    { status: 200 }
  );
}
