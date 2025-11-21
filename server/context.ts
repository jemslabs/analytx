import {prisma} from "@/lib/prisma";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export type Context = {
  prisma: typeof prisma;
  userId?: number | null;
};

export const createContext = async (): Promise<Context> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
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
  return { prisma, userId };
};
