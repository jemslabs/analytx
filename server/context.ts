import { UserRole } from "@/lib/generated/prisma/client/enums";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type Context = {
  prisma: typeof prisma;
  role: UserRole | null;
  userId?: number | null;
};

export const createContext = async (): Promise<Context> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let role: UserRole | null = null;
  let userId: number | null = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
        id: number;
      };
      userId = decoded.id;
    } catch (_) {
      userId = null;
    }
  }
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      userId = null;
      role = null;
    } else {
      role = user.role;
    }
  }
  return { prisma, role, userId };
};
