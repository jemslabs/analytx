import { prisma } from "./prisma";
import { NextResponse } from "next/server";

export async function checkBrandSubscription(brandId: number) {
  const brand = await prisma.brandProfile.findUnique({
    where: { id: brandId },
    include: { subscription: true },
  });

  if (!brand?.subscription || new Date() > new Date(brand.subscription.expiresAt)) {
    return NextResponse.json(
      { msg: "Brand subscription is not active" },
      { status: 403 }
    );
  }

  return null; // active
}
