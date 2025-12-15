"use client";

import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import useAuthStore from "@/stores/useAuth";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type SubscriptionState = "NO_SUBSCRIPTION" | "EXPIRED" | "ACTIVE";

export default function SubscribeButton() {
  const { user, setUser } = useAuthStore();





  const subscriptionState: SubscriptionState = useMemo(() => {
    const subscription = user?.brandProfile?.subscription;
    if (!subscription) return "NO_SUBSCRIPTION";

    const now = new Date();
    const expiresAt = new Date(subscription.expiresAt);
    return now > expiresAt ? "EXPIRED" : "ACTIVE";
  }, [user]);

  const initiateRazorpay = async () => {
    if (!user || user.role !== "BRAND") {
      toast.error("Only brands can activate the Growth plan.");
      return;
    }

    if (!(window as any).Razorpay) {
      toast.error("Payment SDK not loaded.");
      return;
    }

    try {
      const { data: order } = await axios.post("/api/razorpay/create-order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AnalytX",
        description: "Brand Growth Plan",
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            const result = await axios.post("/api/razorpay/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            result.data.success
              ? toast.success("Growth plan activated")
              : toast.error("Payment verification failed");

            const res = await axios.get("/api/auth/user");
            if (res.status === 200) {
              setUser(res.data)
            }
          } catch {
            toast.error("Verification failed");
          }
        },
        prefill: { email: user.email },
        theme: { color: "#7c3aed" },
      };

      // @ts-ignore
      new window.Razorpay(options).open();
    } catch {
      toast.error("Failed to initiate payment");
    }
  };

  if (!user || user.role !== "BRAND") return null;

  const expiresAt = user.brandProfile?.subscription?.expiresAt;

  return (
    <div className="mx-4 my-3 rounded-xl border bg-white px-3 py-2 text-sm">
      {/* ACTIVE / EXPIRED */}
      {subscriptionState !== "NO_SUBSCRIPTION" && (
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "font-medium",
              subscriptionState === "ACTIVE"
                ? "text-emerald-600"
                : "text-red-500"
            )}
          >
            {subscriptionState === "ACTIVE" ? "Plan active" : "Plan expired"}
          </span>

          {/* Hover info */}
          {expiresAt && (
            <div className="group relative">
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />

              <div className="pointer-events-none absolute right-0 top-6 z-50 hidden w-max rounded-md border bg-white px-2 py-1 text-[11px] text-gray-700 shadow-md group-hover:block">
                {subscriptionState === "ACTIVE"
                  ? `Active until ${new Date(expiresAt).toLocaleDateString()}`
                  : `Expired on ${new Date(expiresAt).toLocaleDateString()}`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* NO SUBSCRIPTION */}
      {subscriptionState === "NO_SUBSCRIPTION" && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Unlock campaigns, API access, and advanced analytics.{" "}
            <a
              href="/#pricing"
              className="font-medium text-primary underline underline-offset-4"
            >
              Learn more
            </a>
          </p>

          <Button
            onClick={initiateRazorpay}
            size="sm"
            className="w-full rounded-lg bg-black text-white hover:bg-black/90"
          >
            Upgrade plan
          </Button>
        </div>
      )}

      {/* EXPIRED CTA */}
      {subscriptionState === "EXPIRED" && (
        <Button
          onClick={initiateRazorpay}
          size="sm"
          className="mt-2 w-full rounded-lg bg-black text-white hover:bg-black/90"
        >
          Renew plan
        </Button>
      )}
    </div>
  );
}
