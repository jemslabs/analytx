import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getToken } from "@/lib/generateToken";

const PLAN_AMOUNT = 9999;
const PLAN_DURATION_DAYS = 30;

export async function POST(req: Request) {
  try {
    const userId = await getToken();
    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { msg: "Invalid payment data" },
        { status: 400 }
      );
    }

    // 1️⃣ Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { msg: "Payment verification failed" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch brand + subscription
    const brand = await prisma.brandProfile.findUnique({
      where: { userId },
      include: { subscription: true },
    });

    if (!brand) {
      return NextResponse.json(
        { msg: "Brand profile not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    // 3️⃣ Safety check (should never happen if create-order blocks it)
    if (brand.subscription && brand.subscription.expiresAt > now) {
      return NextResponse.json(
        { msg: "Subscription Plan is already active" },
        { status: 400 }
      );
    }

    const expiresAt = new Date(
      now.getTime() + PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000
    );

    // 4️⃣ Create payment record
    await prisma.paymentRecord.create({
      data: {
        brandId: brand.id,
        amount: PLAN_AMOUNT,
        providerPaymentId: razorpay_payment_id,
      },
    });

    // 5️⃣ Create or update subscription
    await prisma.brandSubscription.upsert({
      where: {
        brandId: brand.id,
      },
      create: {
        brandId: brand.id,
        startedAt: now,
        expiresAt,
      },
      update: {
        startedAt: now,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
