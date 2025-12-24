"use client";

import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import useAuthStore from "@/stores/useAuth";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

type SubscriptionState = "NO_SUBSCRIPTION" | "EXPIRED" | "ACTIVE";

export default function SubscribeButton() {
  const { user, setUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // 🔒 lock to prevent double payment

  const subscriptionState: SubscriptionState = useMemo(() => {
    const subscription = user?.brandProfile?.subscription;
    if (!subscription) return "NO_SUBSCRIPTION";

    const now = new Date();
    const expiresAt = new Date(subscription.expiresAt);
    return now > expiresAt ? "EXPIRED" : "ACTIVE";
  }, [user]);

  const initiateRazorpay = async (code?: string) => {
    if (isProcessing) return; // prevent multiple calls
    if (!user || user.role !== "BRAND") {
      toast.error("Only brands can activate the Growth plan.");
      return;
    }

    if (!(window as any).Razorpay) {
      toast.error("Payment SDK not loaded.");
      return;
    }

    setIsProcessing(true); // lock

    try {
      const { data: order } = await axios.post("/api/razorpay/create-order", {
        couponCode: code || null,
      });

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
              amount: order.finalAmount,
            });

            result.data.success
              ? toast.success("Growth plan activated")
              : toast.error("Payment verification failed");

            const res = await axios.get("/api/auth/user");
            if (res.status === 200) {
              setUser(res.data);
            }
          } catch {
            toast.error("Verification failed");
          } finally {
            setIsProcessing(false); // unlock after handler
          }
        },
        prefill: { email: user.email },
        theme: { color: "#7c3aed" },
      };

      // @ts-ignore
      new window.Razorpay(options).open();
      setOpen(false); // close dialog after initiating
    } catch (err: any) {
      if (err?.response?.data?.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("Failed to initiate payment");
      }
      setIsProcessing(false); // unlock on error
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

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="w-full rounded-lg bg-black text-white hover:bg-black/90"
              >
                Upgrade plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Enter Coupon Code (Optional)</DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) =>
                  setCouponCode(e.target.value.toUpperCase())
                }
                className="mb-4 mt-2"
              />

              <DialogFooter>
                <div className="flex flex-col gap-3 w-full mt-2">
                  <Button
                    onClick={() => initiateRazorpay(couponCode)}
                    className="w-full"
                    disabled={isProcessing} // disable button while processing
                  >
                    Apply & Continue
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => initiateRazorpay()}
                    className="w-full"
                    disabled={isProcessing} // disable button while processing
                  >
                    Continue without coupon code
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* EXPIRED CTA */}
      {subscriptionState === "EXPIRED" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="mt-2 w-full rounded-lg bg-black text-white hover:bg-black/90"
              disabled={isProcessing} // prevent double clicks
            >
              Renew plan
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Coupon Code (Optional)</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(e.target.value.toUpperCase())
              }
              className="mb-4 mt-2"
            />

            <DialogFooter>
              <div className="flex flex-col gap-3 w-full mt-2">
                <Button
                  onClick={() => initiateRazorpay(couponCode)}
                  className="w-full"
                  disabled={isProcessing} // disable while processing
                >
                  Apply & Continue
                </Button>
                <Button
                  variant="outline"
                  onClick={() => initiateRazorpay()}
                  className="w-full"
                  disabled={isProcessing} // disable while processing
                >
                  Continue without coupon code
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
