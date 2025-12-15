import {
  createBrandProfile,
  createCreatorProfileSchema,
  updateBrandProfile,
  updateCreatorProfileSchema,
} from "@/server/utils/zod";
import { router, protectedProcedure, brandProcedure, brandWithSubscriptionProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { generateApiKey, hashApiKey, topNWithOther } from "@/lib/tools";

export const profileRouter = router({
  createBrandProfile: protectedProcedure
    .input(createBrandProfile)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;

        const prisma = ctx.prisma;
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        if (user.role !== "BRAND") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Only brands can create a brand profile.",
          });
        }

        const { name, websiteUrl, industry, description, contactEmail } = input;

        const existing = await prisma.brandProfile.findUnique({
          where: { userId },
        });

        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Brand profile already exists.",
          });
        }

        await prisma.brandProfile.create({
          data: {
            name,
            websiteUrl,
            industry,
            description,
            contactEmail,
            userId: userId,
          },
        });

        return {
          success: true,
          message: "Your brand profile is now set up.",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  updateBrandProfile: protectedProcedure
    .input(updateBrandProfile)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;
        const prisma = ctx.prisma;

        const existing = await prisma.brandProfile.findUnique({
          where: { userId },
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found.",
          });
        }

        const updated = await prisma.brandProfile.update({
          where: { id: existing.id },
          data: input,
        });
        return {
          success: true,
          message: "Your brand profile has been updated.",
          data: updated,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  createCreatorProfile: protectedProcedure
    .input(createCreatorProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;

        const prisma = ctx.prisma;
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }

        if (user.role !== "CREATOR") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Only creators can create a creator profile.",
          });
        }
        const existing = await prisma.creatorProfile.findUnique({
          where: { userId },
        });

        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A creator profile already exists for this account.",
          });
        }

        const { name, bio, niche } = input;

        const profile = await prisma.creatorProfile.create({
          data: {
            userId,
            name,
            bio,
            niche,
          },
        });

        return {
          success: true,
          message: "Your creator profile is now set up.",
          data: profile,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  updateCreatorProfile: protectedProcedure
    .input(updateCreatorProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;
        const prisma = ctx.prisma;

        const existing = await prisma.creatorProfile.findUnique({
          where: { userId },
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Creator profile not found.",
          });
        }

        const updated = await prisma.creatorProfile.update({
          where: { id: existing.id },
          data: input,
        });

        return {
          success: true,
          message: "Your creator profile has been updated.",
          data: updated,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  generateAPIKey: brandWithSubscriptionProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;

    try {
      const prisma = ctx.prisma;
      const brandProfile = await prisma.brandProfile.findUnique({
        where: {
          userId,
        },
      });

      if (!brandProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Brand profile not found",
        });
      }

      const rawApiKey = generateApiKey();
      const hashedApiKey = hashApiKey(rawApiKey);

      await prisma.brandProfile.update({
        where: {
          id: brandProfile.id,
        },
        data: {
          apiKey: hashedApiKey,
        },
      });

      return {
        success: true,
        apiKey: rawApiKey,
      };
    } catch (err) {
      if (err instanceof TRPCError) throw err;
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  getBrandOverview: brandProcedure.query(async ({ ctx }) => {
  const prisma = ctx.prisma;
  const userId = ctx.userId;

  try {
    const brand = await prisma.brandProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!brand) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Brand profile not found",
      });
    }

    const brandId = brand.id;

    const [
      totalCampaigns,
      activeCampaigns,
      totalProducts,

      salesAgg,
      clicksAgg,

      campaigns,
      salesOverTime,
      clicksOverTime,
    ] = await Promise.all([
      prisma.campaign.count({ where: { brandId } }),

      prisma.campaign.count({
        where: { brandId, status: "ACTIVE" },
      }),

      prisma.product.count({ where: { brandId } }),

      prisma.saleEvent.aggregate({
        _sum: { salePrice: true },
        _count: { id: true },
        where: { member: { campaign: { brandId } } },
      }),

      prisma.clickEvent.aggregate({
        _sum: { count: true },
        where: { member: { campaign: { brandId } } },
      }),

      prisma.campaign.findMany({
        where: { brandId },
        include: {
          members: {
            include: {
              sales: true,
              clicks: true,
            },
          },
        },
      }),

      prisma.saleEvent.groupBy({
        by: ["purchasedAt"],
        _count: { id: true },
        where: { member: { campaign: { brandId } } },
        orderBy: { purchasedAt: "asc" },
      }),

      prisma.clickEvent.groupBy({
        by: ["date"],
        _sum: { count: true },
        where: { member: { campaign: { brandId } } },
        orderBy: { date: "asc" },
      }),
    ]);

    const totalSales = salesAgg._count.id ?? 0;
    const totalRevenue = salesAgg._sum.salePrice ?? 0;
    const totalClicks = clicksAgg._sum.count ?? 0;

    const campaignStats = campaigns.map((c) => {
      const sales = c.members.flatMap((m) => m.sales);
      const clicks = c.members.flatMap((m) => m.clicks);

      return {
        campaignId: c.id,
        name: c.name,
        sales: sales.length,
        clicks: clicks.reduce((s, x) => s + x.count, 0),
        revenue: sales.reduce((s, x) => s + x.salePrice, 0),
      };
    });

    const topCampaigns = {
      revenue: topNWithOther(campaignStats, "revenue"),
      sales: topNWithOther(campaignStats, "sales"),
      clicks: topNWithOther(campaignStats, "clicks"),
    };

    return {
      success: true,
      data: {
        totalCampaigns,
        activeCampaigns,
        totalProducts,

        sales: totalSales,
        clicks: totalClicks,
        revenue: totalRevenue,

        salesOverTime,
        clicksOverTime,
        topCampaigns,
      },
    };
  } catch (err) {
    if (err instanceof TRPCError) throw err;
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
})
});
