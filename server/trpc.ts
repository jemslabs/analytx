import {initTRPC, TRPCError} from '@trpc/server';
import type {Context} from './context';

const t = initTRPC.context<Context>().create();
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      userId: ctx.userId,
      prisma: ctx.prisma,
    },
  });
});
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);