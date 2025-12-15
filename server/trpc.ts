import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

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

const enforceCreator = t.middleware(({ ctx, next }) => {
  if (ctx.role !== "CREATOR") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

const enforceBrand = t.middleware(({ ctx, next }) => {
  if (ctx.role !== "BRAND") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

// NEW: Middleware to check active subscription
const enforceActiveSubscription = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });

  const brandProfile = await ctx.prisma.brandProfile.findUnique({
    where: { userId: ctx.userId },
    include: { subscription: true },
  });

  // No subscription
  if (!brandProfile?.subscription) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Upgrade to access this feature",
    });
  }

  const now = new Date();
  // Subscription expired
  if (now > new Date(brandProfile.subscription.expiresAt)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Upgrade to access this feature",
    });
  }

  return next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const creatorProcedure = protectedProcedure.use(enforceCreator);
export const brandProcedure = protectedProcedure.use(enforceBrand);
export const brandWithSubscriptionProcedure = brandProcedure.use(
  enforceActiveSubscription
);
