import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["BRAND", "CREATOR", "ADMIN"]),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedReq = signupSchema.safeParse(data);
    if (!validatedReq.success) {
      return NextResponse.json({ msg: "Invalid Input" }, { status: 400 });
    }

    const { email, password, role } = validatedReq.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    if (user) {
      return NextResponse.json(
        {
          msg: "Account with this email already exists. Please enter another email",
        },
        { status: 400 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      { msg: "Account created successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
