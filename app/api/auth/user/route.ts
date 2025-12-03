import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getToken();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        brandProfile: true,
        creatorProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        brandProfile: user.brandProfile,
        creatorProfile: user.creatorProfile,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
