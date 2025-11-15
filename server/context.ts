import prisma from "@/lib/prisma";
import type { IncomingMessage } from "http";


export type Context = {
  req?: IncomingMessage;
  prisma: typeof prisma;
};

export const createContext = ({ req }: { req?: IncomingMessage } = {}) : Context => {
  return { req, prisma };
};