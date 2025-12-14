import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";

const PLAN_AMOUNT = 9999;
export async function POST() {
  const userId = await getToken();
  try {
    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }
    if (user.role !== "BRAND") {
      return NextResponse.json(
        { msg: "Only brand can purchase growth plan" },
        { status: 400 }
      );
    }

    const brand = await prisma.brandProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!brand) {
      return NextResponse.json(
        { msg: "Brand profile not found" },
        { status: 404 }
      );
    }
    const existingSub = await prisma.brandSubscription.findUnique({
      where: { brandId: brand.id },
    });

    if (existingSub && existingSub.expiresAt > new Date()) {
      return NextResponse.json(
        { msg: "Subscription already active" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: PLAN_AMOUNT * 100,
      currency: "INR",
      receipt: `receipt_${brand.id}_${Date.now()}`,
      notes: {
        brandId: String(brand.id),
        plan: "BRAND_GROWTH",
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
