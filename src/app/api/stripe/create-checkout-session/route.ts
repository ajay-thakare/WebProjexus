import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

const RequestBodySchema = z.object({
  subAccountConnectAccId: z.string(),
  prices: z.array(
    z.object({
      recurring: z.boolean(),
      productId: z.string(),
    })
  ),
  subaccountId: z.string(),
});

const envSchema = z.object({
  NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT: z.string().min(1),
  NEXT_PUBLIC_PLATFORM_ONETIME_FEE: z.string().min(1),
  NEXT_PUBLIC_PLATFORM_AGENCY_PERCENT: z.string().min(1),
});

export async function POST(req: Request) {
  const env = envSchema.safeParse(process.env);

  if (!env.success) {
    console.error("Environment variables missing:", env.error);
    return NextResponse.json(
      { error: "Server configuration error / Fees do not exist." },
      { status: 500 }
    );
  }

  const origin = req.headers.get("origin");

  const body = await req.json();

  const { subAccountConnectAccId, prices } = RequestBodySchema.parse(body);

  try {
    const subscriptionPriceExists = prices.some((price) => price.recurring);

    const session = await stripe.checkout.sessions.create(
      {
        line_items: prices.map((price) => ({
          price: price.productId,
          quantity: 1,
        })),
        ...(subscriptionPriceExists
          ? {
              subscription_data: {
                metadata: { connectAccountSubscriptions: "true" },
                application_fee_percent:
                  +env.data.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT,
              },
            }
          : {
              payment_intent_data: {
                metadata: { connectAccountPayments: "true" },
                application_fee_amount:
                  +env.data.NEXT_PUBLIC_PLATFORM_ONETIME_FEE * 100,
              },
            }),
        mode: subscriptionPriceExists ? "subscription" : "payment",
        ui_mode: "embedded",
        redirect_on_completion: "never",
      },
      { stripeAccount: subAccountConnectAccId }
    );

    return NextResponse.json(
      { clientSecret: session.client_secret },
      {
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("🔴Stripe Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Payment processing failed",
      },
      { status: 500 }
    );
  }
}

//---------------
export async function OPTIONS(request: Request) {
  const allowedOrigin = request.headers.get("origin");
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400",
    },
  });

  return response;
}
