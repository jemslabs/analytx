import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const clickEventSchema = z.object({
  referralCode: z.string(),
});
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const validatedData = clickEventSchema.safeParse(data);
    if (!validatedData.success) {
      return NextResponse.json(
        { msg: "Invalid Referral Code" },
        { status: 400 }
      );
    }

    const { referralCode: code } = validatedData.data;

    // 1. Find referral code
    const referralCode = await prisma.referralCode.findUnique({
      where: { code },
    });

    if (!referralCode) {
      return NextResponse.json(
        { msg: "Referral Code not found" },
        { status: 400 }
      );
    }

    // 2. Find campaign + member
    const member = await prisma.campaignMember.findUnique({
      where: { id: referralCode.memberId },
      include: { campaign: true },
    });

    if (!member) {
      return NextResponse.json(
        { msg: "Invalid Referral Code" },
        { status: 404 }
      );
    }

    if (member.campaign.status !== "ACTIVE") {
      return NextResponse.json(
        { msg: "Campaign is not active" },
        { status: 400 }
      );
    }

    // 3. Compute today's date (no time)
    const now = new Date();
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 4. Upsert click counter
    await prisma.clickEvent.upsert({
      where: {
        memberId_platform_date: {
          memberId: member.id,
          platform: referralCode.platform,
          date: dateOnly,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        memberId: member.id,
        platform: referralCode.platform,
        date: dateOnly,
        count: 1,
      },
    });

    // 5. Return redirect URL instantly
    return NextResponse.json(
      { msg: "Click counted", redirectUrl: member.campaign.redirectUrl },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
