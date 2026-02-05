import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const freeTrialSchema = z.object({
  brandId: z.number(),
});
const PLAN_DURATION_DAYS = 14;
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedReq = freeTrialSchema.safeParse(data);
    if (!validatedReq.success) {
      return NextResponse.json({ msg: "Invalid Input" }, { status: 400 });
    }
    const userId = await getToken();
    if (!userId) {
      return NextResponse.json({ msg: "UNAUTHORIZED" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json({ msg: "UNAUTHORIZED" }, { status: 400 });
    }

    const brand = await prisma.brandProfile.findUnique({
      where: { id: validatedReq.data.brandId },
      include: { subscription: true },
    });

    if (!brand) {
      return NextResponse.json(
        { msg: "Brand profile not found" },
        { status: 404 },
      );
    }
    if (brand.subscription?.usedFreeTrial) {
      return NextResponse.json(
        { msg: "Free trial already used" },
        { status: 400 },
      );
    }

    const now = new Date();
    if (brand.subscription && brand.subscription.expiresAt > now) {
      return NextResponse.json(
        { msg: "Subscription Plan is already active" },
        { status: 400 },
      );
    }

    const expiresAt = new Date(
      now.getTime() + PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000,
    );

    await prisma.brandSubscription.upsert({
      where: {
        brandId: brand.id,
      },
      create: {
        brandId: brand.id,
        startedAt: now,
        expiresAt,
        usedFreeTrial: true,
      },
      update: {
        startedAt: now,
        expiresAt,
        usedFreeTrial: true,
      },
    });

    return NextResponse.json({ msg: "Granted Free Trial" }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
