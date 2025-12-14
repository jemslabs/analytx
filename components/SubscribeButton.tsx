"use client"
import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import useAuthStore from "@/stores/useAuth";

function SubscribeButton() {
  const { user } = useAuthStore();

  const initiateRazorpay = async () => {
    if (!user) {
      toast.error("Please login as a brand to subscribe.");
      return;
    }

    if(user.role !== "BRAND"){
        toast.error("You must be brand to active growth plan");
        return;
    }

    if (typeof window === "undefined" || !(window as any).Razorpay) {
      toast.error("Payment SDK not loaded. Please refresh.");
      return;
    }

    try {
      const res = await axios.post("/api/razorpay/create-order");
      const order = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Tranzo",
        description: "Brand Growth Plan Subscription",
        order_id: order.orderId,

        handler: async (response: any) => {
          try {
            const result = await axios.post("/api/razorpay/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.data.success) {
              toast.success("Growth Plan activated successfully!");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch {
            toast.error("Unable to verify payment.");
          }
        },

        prefill: {
          email: user.email,
        },

        theme: {
          color: "#7c3aed",
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Failed to initiate Growth Plan payment.");
    }
  };

  return <Button onClick={initiateRazorpay}>Subscribe to Growth Plan</Button>;
}

export default SubscribeButton;
