import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getToken();
    if (!userId) {
      return NextResponse.json({ msg: "UNAUTHORIZED" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json({ msg: "UNAUTHORIZED" }, { status: 403 });
    }

    const brands = await prisma.brandProfile.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        subscription: {
          select: {
            usedFreeTrial: true,
          },
        },
      },
    });

    return NextResponse.json(brands, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
