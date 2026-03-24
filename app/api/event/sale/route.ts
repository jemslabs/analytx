import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyBrandApiKey } from "@/lib/verifyBrandApiKey";
import { checkBrandSubscription } from "@/lib/checkBrandSubscription";
import { z } from "zod";

const saleEventSchema = z.object({
  referralCode: z.string(),
  skuId: z.string(),
  salePrice: z.number().positive(),
});
export async function POST(req: Request) {
  const brand = await verifyBrandApiKey(req);
  if (!brand)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    const validatedData = saleEventSchema.safeParse(data);
    if (!validatedData.success) {
      return NextResponse.json({ msg: "Invalid Data" }, { status: 400 });
    }
    const { referralCode: code, skuId, salePrice } = validatedData.data;
    const referralCode = await prisma.referralCode.findUnique({
      where: { code },
      select: {
        memberId: true,
        platform: true,
      },
    });
    if (!referralCode) {
      return NextResponse.json(
        { msg: "Referral Code not found" },
        { status: 400 },
      );
    }
    // 1. Validate Member
    const member = await prisma.campaignMember.findUnique({
      where: { id: referralCode.memberId },
      include: {
        campaign: {
          select: {
            id: true,
            status: true,
            brandId: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { msg: "Invalid referralCode" },
        { status: 404 },
      );
    }
    if (member.campaign.status !== "ACTIVE") {
      return NextResponse.json(
        { msg: "Campaign is not active" },
        { status: 400 },
      );
    }
    const subCheck = await checkBrandSubscription(member.campaign.brandId);
    if (subCheck) return subCheck;
    // 2. Validate Product belongs to brand
    const product = await prisma.product.findFirst({
      where: {
        brandId: brand.id,
        skuId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { msg: "Product not found for this brand" },
        { status: 404 },
      );
    }

    // 3. Check product is part of campaign
    const campaignProduct = await prisma.campaignProduct.findFirst({
      where: {
        productId: product.id,
        campaignId: member.campaignId,
      },
    });

    if (!campaignProduct) {
      return NextResponse.json(
        { msg: "Product not part of this campaign" },
        { status: 400 },
      );
    }
    // 4. Create Sale
    await prisma.saleEvent.create({
      data: {
        memberId: member.id,
        salePrice,
        campaignProductId: campaignProduct.id,
        platform: referralCode.platform,
      },
    });

    return NextResponse.json(
      {
        msg: "Sale recorded",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ msg: "Internal error" }, { status: 500 });
  }
}
