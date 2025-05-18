import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

type Address = {
  line1: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

type ShippingInfo = {
  address: Address;
  name: string;
};

type StripeCustomerType = {
  email: string;
  name: string;
  address: Address;
  shipping: ShippingInfo;
};

// -------
export async function POST(req: Request) {
  const { email, name, shipping, address }: StripeCustomerType =
    await req.json();

  if (!email || !address || !name || !shipping)
    return new NextResponse("Missing data", {
      status: 400,
    });

  if (!email.includes("@")) {
    return new NextResponse("Invalid email format", { status: 400 });
  }

  // create Stripe Customer
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      address,
      shipping,
    });

    return NextResponse.json(
      {
        customerId: customer.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔴 Stripe Customer Creation Error:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
