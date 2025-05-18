import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const { customerId, priceId } = await req.json();

  if (!customerId || !priceId)
    return new NextResponse("Customer Id or price id is missing", {
      status: 400,
    });

  const subscriptionExists = await db.agency.findFirst({
    where: { customerId },
    include: { Subscription: true },
  });

  try {
    if (
      subscriptionExists?.Subscription?.subscriptionId &&
      subscriptionExists.Subscription.active
    ) {
      // Update the subscription instead of creating one
      if (!subscriptionExists.Subscription.subscriptionId) {
        throw new Error(
          "Could not find the subscription Id to update the subscription."
        );
      }

      console.log("Updating the subscription");
      const currentSubscriptionDetails = await stripe.subscriptions.retrieve(
        subscriptionExists.Subscription.subscriptionId
      );

      const subscription = await stripe.subscriptions.update(
        subscriptionExists.Subscription.subscriptionId,
        {
          items: [
            {
              id: currentSubscriptionDetails.items.data[0].id,
              deleted: true,
            },
            { price: priceId },
          ],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.confirmation_secret"],
        }
      );

      // Get the client secret from the latest invoice's confirmation secret
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const confirmationSecret = invoice.confirmation_secret as {
        client_secret: string;
      };
      const clientSecret = confirmationSecret?.client_secret;

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret,
      });
    } else {
      console.log("Creating a new subscription");

      // Create subscription without expansion
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.confirmation_secret"],
      });

      // Get the client secret from the latest invoice's confirmation secret
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const confirmationSecret = invoice.confirmation_secret as {
        client_secret: string;
      };
      const clientSecret = confirmationSecret?.client_secret;

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret,
      });
    }
  } catch (error) {
    console.log("🔴 Error", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
