"use client";
import { useCallback, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plan } from "@prisma/client";

type Props = {
  selectedPriceId: string | Plan;
};

const SubscriptionForm = ({ selectedPriceId }: Props) => {
  const elements = useElements();
  const stripe = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [priceError, setPriceError] = useState("");

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedPriceId) {
        setPriceError("You need to select a plan to subscribe.");
        return;
      }

      if (!stripe || !elements) {
        toast.error("Payment processing is not ready. Please try again.");
        return;
      }

      setIsProcessing(true);
      setPriceError("");

      try {
        // Choose the correct confirmation method based on intent type
        let result;

        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
          },
        });

        if (error) {
          throw new Error(error.message || "Payment failed");
        }

        toast.success("Payment successfully processed!", {
          duration: 5000,
          icon: "🎉",
        });
      } catch (error) {
        console.error("Payment error:", error);
        toast.error(
          "We couldn't process your payment. Please try a different card.",
          { duration: 5000 }
        );

        setPriceError(
          error instanceof Error
            ? error.message
            : "An error occurred during payment processing"
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements, selectedPriceId]
  );

  const isDisabled = !stripe || isProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <small className="text-destructive">{priceError}</small>
      <PaymentElement />

      <Button type="submit" disabled={isDisabled} className="mt-4 w-full">
        {isProcessing ? "Processing..." : "Subscribe Now"}
      </Button>
    </form>
  );
};

export default SubscriptionForm;
