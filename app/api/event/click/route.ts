import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {
    const { referralCode: code } = await req.json();

    if (!code) {
      return NextResponse.json({ msg: "Missing referralCode" }, { status: 400 });
    }

    const referralCode = await prisma.referralCode.findUnique({
      where: {
        code
      }
    })
    if (!referralCode) {
      return NextResponse.json({ msg: "Referral Code not found" }, { status: 400 });
    }
    const member = await prisma.campaignMember.findUnique({
      where: { id: referralCode.memberId },
      include: {
        campaign: true
      }
    });

    if (!member) {
      return NextResponse.json({ msg: "Invalid Referral Code" }, { status: 404 });
    }

    const ip =
      req.headers.get("x-nf-client-connection-ip") ??
      req.headers.get("client-ip") ??
      req.headers.get("x-forwarded-for") ??
      "unknown";

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // check if already clicked today
    const existing = await prisma.clickEvent.findFirst({
      where: {
        memberId: member.id,
        ipAddress: ip,
        platform: referralCode.platform,
        timestamp: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { msg: "Click already counted today" },
        { status: 200 }
      );
    }

    // store new click
    await prisma.clickEvent.create({
      data: {
        memberId: member.id,
        ipAddress: ip,
        platform: referralCode.platform
      },
    });

    return NextResponse.json({ msg: "Click stored", redirectUrl: member.campaign.redirectUrl }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

