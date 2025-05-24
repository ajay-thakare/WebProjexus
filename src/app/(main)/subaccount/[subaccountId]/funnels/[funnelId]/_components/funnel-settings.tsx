import React from "react";
import { Funnel, SubAccount } from "@prisma/client";
import { db } from "@/lib/db";
import { getConnectAccountProducts } from "@/lib/stripe/stripe-actions";

import FunnelForm from "@/components/forms/funnel-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FunnelProductsTable from "./funnel-products-table";
import { ShoppingCart, CreditCard, AlertCircle, Sparkles } from "lucide-react";

interface FunnelSettingsProps {
  subaccountId: string;
  defaultData: Funnel;
}

const FunnelSettings = async ({
  subaccountId,
  defaultData,
}: FunnelSettingsProps) => {
  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });

  // todo - go connect your stripe to sell products
  if (!subaccountDetails) return;
  if (!subaccountDetails.connectAccountId) {
    console.log(
      "❌ No connectAccountId found in subaccountDetails:",
      subaccountDetails
    );
    return;
  }
  const products = await getConnectAccountProducts(
    subaccountDetails.connectAccountId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 p-6">
      {/* Header Section */}
      <div className="mb-8 use-automation-zoom-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Funnel Settings
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Configure your funnel products and settings to maximize conversions
        </p>
      </div>

      <div className="flex gap-8 flex-col xl:!flex-row max-w-7xl mx-auto">
        {/* Products Card */}
        <Card className="flex-1 flex-shrink relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm use-automation-zoom-in">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600"></div>

          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Funnel Products
              </CardTitle>
            </div>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Select the products and services you wish to sell on this funnel.
              You can sell one-time and recurring products to maximize your
              revenue potential.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            {subaccountDetails.connectAccountId ? (
              <div className="relative">
                <FunnelProductsTable
                  defaultData={defaultData}
                  products={products}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Stripe Connection Required
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      Connect your Stripe account to start selling products
                      through your funnel
                    </p>
                  </div>
                  <button className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Connect Stripe Account
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Section */}
        <div className="xl:w-96 use-automation-zoom-in">
          <div className="sticky top-6">
            <FunnelForm subAccountId={subaccountId} defaultData={defaultData} />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-cyan-600/20 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default FunnelSettings;
