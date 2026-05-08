import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { applyCoupon } from "@/lib/tools";
import { NextResponse } from "next/server";

const PLAN_AMOUNT = 999; // INR

export async function POST(req: Request) {
  try {
    const userId = await getToken();
    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { couponCode } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    if (user.role !== "BRAND") {
      return NextResponse.json(
        { msg: "Only brand can purchase plan" },
        { status: 400 },
      );
    }

    const brand = await prisma.brandProfile.findUnique({
      where: { userId },
    });

    if (!brand) {
      return NextResponse.json(
        { msg: "Brand profile not found" },
        { status: 404 },
      );
    }

    const existingSub = await prisma.brandSubscription.findUnique({
      where: { brandId: brand.id },
    });

    if (existingSub && existingSub.expiresAt > new Date()) {
      return NextResponse.json(
        { msg: "Subscription already active" },
        { status: 400 },
      );
    }

    let pricing;
    try {
      pricing = applyCoupon(PLAN_AMOUNT, couponCode);
    } catch (err: any) {
      // ✅ Return proper error message for invalid or expired coupon
      return NextResponse.json({ msg: err.message }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: pricing.finalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${brand.id}_${Date.now()}`,
      notes: {
        brandId: String(brand.id),
        plan: "BRAND_STARTER",
        originalAmount: PLAN_AMOUNT,
        finalAmount: pricing.finalAmount,
        discountPercent: pricing.discountPercent ?? 0,
        couponCode: pricing.applied ? couponCode : "NONE",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      finalAmount: pricing.finalAmount,
    });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
