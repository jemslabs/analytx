import {
  acceptCampaignInviteSchema,
  addProductInCampaignSchema,
  completeCampaignSchema,
  createCampaignSchema,
  generateReferralCodeSchema,
  removeProductFromCampaignSchema,
  sendCampaignInviteSchema,
  startCampaignSchema,
  updateCampaignSchema,
} from "@/server/utils/zod";
import { router, brandProcedure, creatorProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { generateUniqueReferralCode } from "@/lib/tools";
import { z } from "zod";

function topNWithOther<T extends Record<string, any>>(
  items: T[],
  metricKey: keyof T,
  n = 3,
  otherLabel = "Other"
) {
  const sorted = [...items].sort(
    (a, b) => (b[metricKey] as number) - (a[metricKey] as number)
  );

  const top = sorted.slice(0, n);
  const rest = sorted.slice(n);

  if (rest.length === 0) return top;

  const otherValue = rest.reduce(
    (sum, item) => sum + (item[metricKey] as number),
    0
  );

  return [
    ...top,
    {
      ...Object.fromEntries(Object.keys(top[0]).map((k) => [k, 0])),
      name: otherLabel,
      [metricKey]: otherValue,
    },
  ];
}

export const campaignRouter = router({
  createCampaign: brandProcedure
    .input(createCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
      try {
        const brand = await prisma.brandProfile.findUnique({
          where: {
            userId,
          },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }

        const {
          name,
          redirectUrl,
          payoutModel,
          cpsValue,
          cpcValue,
          cpsCommissionType,
        } = input;

        await prisma.campaign.create({
          data: {
            brandId: brand.id,
            name,
            redirectUrl,
            payoutModel,
            cpsCommissionType,
            cpsValue,
            cpcValue,
          },
        });

        return { success: true, message: "Campaign Created" };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  updateCampaign: brandProcedure
    .input(updateCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
      try {
        const brand = await prisma.brandProfile.findUnique({
          where: {
            userId,
          },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }

        const { campaignId, name, redirectUrl } = input;

        const campaign = await prisma.campaign.findUnique({
          where: {
            id: campaignId,
          },
        });
        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found",
          });
        }

        if (campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized to modify this campaign",
          });
        }

        await prisma.campaign.update({
          where: {
            id: campaign.id,
          },
          data: {
            name,
            redirectUrl,
          },
        });

        return { success: true, message: "Campaign Updated" };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getAllCampaigns: brandProcedure.query(async ({ ctx }) => {
    const prisma = ctx.prisma;
    const userId = ctx.userId;
    try {
      const brand = await prisma.brandProfile.findUnique({
        where: {
          userId,
        },
      });

      if (!brand) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Brand profile not found",
        });
      }

      const campaigns = await prisma.campaign.findMany({
        where: {
          brandId: brand.id,
        },
        include: {
          _count: {
            select: {
              products: true,
              members: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return { success: true, data: campaigns };
    } catch (err) {
      if (err instanceof TRPCError) throw err;
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  getCampaignOverview: brandProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;

      try {
        const brand = await prisma.brandProfile.findUnique({
          where: { userId },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }

        const campaign = await prisma.campaign.findFirst({
          where: {
            id: input.campaignId,
            brandId: brand.id,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found",
          });
        }

        const campaignId = input.campaignId;

        const [salesCount, clicksAgg, revenueAgg, creators, products] =
          await Promise.all([
            prisma.saleEvent.count({
              where: { member: { campaignId } },
            }),

            prisma.clickEvent.aggregate({
              _sum: { count: true },
              where: { member: { campaignId } },
            }),

            prisma.saleEvent.aggregate({
              _sum: { salePrice: true },
              where: { member: { campaignId } },
            }),

            prisma.campaignMember.count({ where: { campaignId } }),

            prisma.campaignProduct.count({ where: { campaignId } }),
          ]);

        const totalClicks = clicksAgg._sum.count ?? 0;
        const totalRevenue = revenueAgg._sum.salePrice ?? 0;
        const conversionPercentage =
          totalClicks > 0 ? (salesCount / totalClicks) * 100 : 0;

        const salesOverTime = await prisma.saleEvent.groupBy({
          by: ["purchasedAt"],
          _count: { id: true },
          where: { member: { campaignId } },
          orderBy: { purchasedAt: "asc" },
        });

        const clicksOverTime = await prisma.clickEvent.groupBy({
          by: ["date"],
          _sum: { count: true },
          where: { member: { campaignId } },
          orderBy: { date: "asc" },
        });

        const topCreatorsRaw = await prisma.campaignMember.findMany({
          where: { campaignId },
          include: {
            creator: true,
            sales: true,
            clicks: true,
          },
        });

        const creatorsStats = topCreatorsRaw.map((m) => ({
          creatorId: m.creatorId,
          name: m.creator.name,
          sales: m.sales.length,
          clicks: m.clicks.reduce((sum, c) => sum + c.count, 0),
          revenue: m.sales.reduce((sum, s) => sum + s.salePrice, 0),
        }));

        const topCreators = {
          revenue: topNWithOther(creatorsStats, "revenue"),
          clicks: topNWithOther(creatorsStats, "clicks"),
          sales: topNWithOther(creatorsStats, "sales"),
        };

        const productList = await prisma.campaignProduct.findMany({
          where: { campaignId },
          include: {
            product: true,
            sales: true,
          },
        });

        const productStats = productList.map((p) => ({
          productId: p.productId,
          name: p.product.name,
          sales: p.sales.length,
          revenue: p.sales.reduce((sum, s) => sum + s.salePrice, 0),
        }));

        const topProducts = {
          sales: topNWithOther(productStats, "sales"),
          revenue: topNWithOther(productStats, "revenue"),
        };

        // -------------------------------------------
        // NEW FEATURE: TOP PLATFORMS (CLICKS + SALES)
        // -------------------------------------------
        const platformClicks = await prisma.clickEvent.groupBy({
          by: ["platform"],
          _sum: { count: true },
          where: { member: { campaignId } },
        });

        const platformSales = await prisma.saleEvent.groupBy({
          by: ["platform"],
          _count: { id: true },
          where: { member: { campaignId } },
        });

        const platformClicksMapped = platformClicks.map((p) => ({
          name: p.platform,
          clicks: p._sum.count ?? 0,
        }));

        const platformSalesMapped = platformSales.map((p) => ({
          name: p.platform,
          sales: p._count.id ?? 0,
        }));

        const topPlatforms = {
          clicks: topNWithOther(platformClicksMapped, "clicks"),
          sales: topNWithOther(platformSalesMapped, "sales"),
        };

        return {
          success: true,
          data: {
            sales: salesCount,
            clicks: totalClicks,
            revenue: totalRevenue,
            conversionPercentage,
            creators,
            products,
            salesOverTime,
            clicksOverTime,
            topCreators,
            topProducts,
            topPlatforms,
          },
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getCampaignDetails: brandProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;

      try {
        const brand = await prisma.brandProfile.findUnique({
          where: { userId },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }

        // Validate campaign belongs to brand
        const campaign = await prisma.campaign.findFirst({
          where: {
            id: input.campaignId,
            brandId: brand.id,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found",
          });
        }

        return { success: true, campaign };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  addProductInCampaign: brandProcedure
    .input(addProductInCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
      try {
        const brand = await prisma.brandProfile.findUnique({
          where: {
            userId,
          },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }
        const campaign = await prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign does not exist.",
          });
        }

        if (campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You do not have permission to modify this campaign.",
          });
        }
        if (campaign.status !== "DRAFT") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Products can only be modified when the campaign is in draft mode.",
          });
        }

        const product = await prisma.product.findUnique({
          where: {
            id: input.productId,
          },
        });
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product doesn't exist",
          });
        }
        if (product.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only add your own products to this campaign.",
          });
        }

        if (product.status === "UNAVAILABLE") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You can only add products that are available.",
          });
        }

        const productExistsInCampaign = await prisma.campaignProduct.findUnique(
          {
            where: {
              campaignId_productId: {
                campaignId: campaign.id,
                productId: product.id,
              },
            },
          }
        );

        if (productExistsInCampaign) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Product already exists in this campaign.",
          });
        }

        await prisma.campaignProduct.create({
          data: {
            campaignId: campaign.id,
            productId: product.id,
          },
        });

        return {
          success: true,
          message: "Product added to this campaign.",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getCampaignProducts: brandProcedure
    .input(
      z.object({
        campaignId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
      try {
        const brand = await prisma.brandProfile.findUnique({
          where: {
            userId,
          },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }
        const campaign = await prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign does not exist.",
          });
        }

        if (campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You do not have permission to access this campaign.",
          });
        }

        const campaignProducts = await prisma.campaignProduct.findMany({
          where: {
            campaignId: campaign.id,
          },
          include: {
            product: true,
          },
        });

        return { success: true, products: campaignProducts };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  removeProductFromCampaign: brandProcedure
    .input(removeProductFromCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
      const { campaignProductId } = input;

      try {
        const brand = await prisma.brandProfile.findUnique({
          where: { userId },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }

        const campaignProduct = await prisma.campaignProduct.findUnique({
          where: { id: campaignProductId },
          include: { campaign: true },
        });

        if (!campaignProduct) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign product not found",
          });
        }

        if (campaignProduct.campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You do not have permission to modify this campaign.",
          });
        }

        if (campaignProduct.campaign.status !== "DRAFT") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Products can only be removed when the campaign is in draft mode.",
          });
        }

        await prisma.campaignProduct.delete({
          where: { id: campaignProductId },
        });

        return {
          success: true,
          message: "Product removed from campaign.",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  sendCampaignInvite: brandProcedure
    .input(sendCampaignInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
      try {
        const brand = await prisma.brandProfile.findUnique({
          where: {
            userId,
          },
          include: {
            user: true,
          },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }
        if (input.email === brand.user.email) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot invite yourself.",
          });
        }

        const campaign = await prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found",
          });
        }
        if (campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You do not have permission to modify this campaign.",
          });
        }
        if (campaign.status !== "DRAFT") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot send campaign invite",
          });
        }
        const existingInvite = await prisma.campaignInvite.findUnique({
          where: {
            campaignId_email: {
              campaignId: campaign.id,
              email: input.email,
            },
          },
        });

        if (existingInvite) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Invite already sent to this email.",
          });
        }
        await prisma.campaignInvite.create({
          data: {
            campaignId: campaign.id,
            email: input.email,
          },
        });

        return {
          success: true,
          message: `Invite Sent to ${input.email}`,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getCampaignInvites: brandProcedure
    .input(
      z.object({
        campaignId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
      try {
        const brand = await prisma.brandProfile.findUnique({
          where: {
            userId,
          },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }
        const campaign = await prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign does not exist.",
          });
        }

        if (campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You do not have permission to access this campaign.",
          });
        }

        const campaignInvites = await prisma.campaignInvite.findMany({
          where: {
            campaignId: campaign.id,
          },
        });

        return { success: true, invites: campaignInvites };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getMyCampaignInvites: creatorProcedure.query(async ({ ctx }) => {
    const prisma = ctx.prisma;
    const userId = ctx.userId;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { creatorProfile: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      if (!user.creatorProfile) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be a creator to access invites.",
        });
      }
      const invites = await prisma.campaignInvite.findMany({
        where: { email: user.email },
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              brand: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return { success: true, invites };
    } catch (err) {
      if (err instanceof TRPCError) throw err;
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  getCampaignCreators: brandProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;

      try {
        const brand = await prisma.brandProfile.findUnique({
          where: {
            userId,
          },
        });

        if (!brand) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Brand profile not found",
          });
        }
        const campaign = await prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign does not exist.",
          });
        }

        if (campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You do not have permission to access this campaign.",
          });
        }

        const creators = await prisma.campaignMember.findMany({
          where: {
            campaignId: campaign.id,
          },
          include: {
            creator: true,
          },
        });

        return { success: true, creators };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  acceptCampaignInvite: creatorProcedure
    .input(acceptCampaignInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;

      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { creatorProfile: true },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }
        const creator = user.creatorProfile;
        if (!creator) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be a creator to accept invites.",
          });
        }

        const invite = await prisma.campaignInvite.findUnique({
          where: { id: input.campaignInviteId },
        });

        if (!invite) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign Invite not found.",
          });
        }

        if (invite.status !== "PENDING") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Campaign Invite is not pending.",
          });
        }

        if (invite.email !== user?.email) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not invited to join this campaign.",
          });
        }

        const campaign = await prisma.campaign.findUnique({
          where: {
            id: invite.campaignId,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found",
          });
        }
        if (campaign.status !== "DRAFT") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot join this campaign",
          });
        }

        // Ensure user is not already a member
        const existingMember = await prisma.campaignMember.findUnique({
          where: {
            campaignId_creatorId: {
              campaignId: invite.campaignId,
              creatorId: creator.id,
            },
          },
        });

        if (existingMember) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You are already part of this campaign.",
          });
        }

        // Transaction
        return await prisma.$transaction(async (tx) => {
          // Accept invite
          await tx.campaignInvite.update({
            where: { id: invite.id },
            data: { status: "ACCEPTED" },
          });

          // Add member
          await tx.campaignMember.create({
            data: {
              campaignId: invite.campaignId,
              creatorId: creator.id,
            },
          });

          return {
            success: true,
            message: "Invite accepted. You are now a campaign member.",
          };
        });
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getMyCampaigns: creatorProcedure.query(async ({ ctx }) => {
    const prisma = ctx.prisma;
    const userId = ctx.userId;
    try {
      const creatorProfile = await prisma.creatorProfile.findUnique({
        where: {
          userId,
        },
      });

      if (!creatorProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Your creator profile not found.",
        });
      }

      const campaigns = await prisma.campaignMember.findMany({
        where: {
          creatorId: creatorProfile.id,
        },
        include: {
          campaign: true,
        },
      });

      return { success: true, campaigns };
    } catch (err) {
      if (err instanceof TRPCError) throw err;
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  generateReferralCode: creatorProcedure
    .input(generateReferralCodeSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;

      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { creatorProfile: true },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }
        const creator = user.creatorProfile;
        if (!creator) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be a creator to generate referral codes.",
          });
        }
        const { campaignMemberId, platform } = input;
        const member = await prisma.campaignMember.findFirst({
          where: {
            id: campaignMemberId,
            creatorId: creator.id,
          },
        });
        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign member not found",
          });
        }

        const campaign = await prisma.campaign.findUnique({
          where: {
            id: member.campaignId,
          },
        });
        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found",
          });
        }

        if (campaign.status !== "ACTIVE") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot generate referral code for inactive campaign",
          });
        }

        const code = generateUniqueReferralCode();

        const referralCodeExists = await prisma.referralCode.findUnique({
          where: {
            memberId_platform: {
              memberId: member.id,
              platform,
            },
          },
        });

        if (referralCodeExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Only one referral code per platform is allowed",
          });
        }
        await prisma.referralCode.create({
          data: {
            memberId: member.id,
            code,
            platform,
          },
        });

        return {
          success: true,
          message: "Referral Code Generated",
          code,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getMyReferralCodes: creatorProcedure
    .input(
      z.object({
        campaignMemberId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;

      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { creatorProfile: true },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }
        const creator = user.creatorProfile;
        if (!creator) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be a creator to get referral codes.",
          });
        }
        const { campaignMemberId } = input;
        const member = await prisma.campaignMember.findFirst({
          where: {
            id: campaignMemberId,
            creatorId: creator.id,
          },
        });
        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign member not found",
          });
        }

        const referralCodes = await prisma.referralCode.findMany({
          where: {
            memberId: member.id,
          },
          orderBy: { createdAt: "desc" },
        });

        return {
          success: true,
          referralCodes,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  startCampaign: brandProcedure
    .input(startCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
      try {
        const now = new Date();
        const brand = await prisma.brandProfile.findUnique({
          where: {
            userId,
          },
        });

        if (!brand) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be a brand to start a campaign.",
          });
        }

        const campaign = await prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found.",
          });
        }

        if (campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You do not have permission to modify this campaign.",
          });
        }

        if (campaign.status !== "DRAFT") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Only draft campaigns can be activated.",
          });
        }

        await prisma.campaign.update({
          where: {
            id: campaign.id,
          },
          data: {
            status: "ACTIVE",
            startedAt: now,
          },
        });
        return {
          success: true,
          message: "Campaign Started",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  completeCampaign: brandProcedure
    .input(completeCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;

      try {
        const now = new Date();

        const brand = await prisma.brandProfile.findUnique({
          where: { userId },
        });

        if (!brand) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be a brand to complete a campaign.",
          });
        }

        const campaign = await prisma.campaign.findUnique({
          where: { id: input.campaignId },
        });

        if (!campaign) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found.",
          });
        }

        if (campaign.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You do not have permission to modify this campaign.",
          });
        }

        if (campaign.status !== "ACTIVE") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Only active campaigns can be completed.",
          });
        }

        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            status: "COMPLETED",
            completedAt: now,
          },
        });

        return {
          success: true,
          message: "Campaign completed.",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getCreatorAnalytics: brandProcedure
  .input(z.object({ campaignMemberId: z.number() }))
  .query(async ({ ctx, input }) => {
    const prisma = ctx.prisma;
    const memberId = input.campaignMemberId;

    const member = await prisma.campaignMember.findUnique({
      where: { id: memberId },
      include: { campaign: true },
    });

    if (!member) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Creator not part of this campaign",
      });
    }

    const campaign = member.campaign;

    const [salesCount, clicksAgg, revenueAgg] = await Promise.all([
      prisma.saleEvent.count({ where: { memberId } }),
      prisma.clickEvent.aggregate({
        _sum: { count: true },
        where: { memberId },
      }),
      prisma.saleEvent.aggregate({
        _sum: { salePrice: true },
        where: { memberId },
      }),
    ]);

    const totalClicks = clicksAgg._sum.count ?? 0;
    const totalRevenue = revenueAgg._sum.salePrice ?? 0;
    const conversionRate =
      totalClicks > 0 ? (salesCount / totalClicks) * 100 : 0;

    const salesOverTime = await prisma.saleEvent.groupBy({
      by: ["purchasedAt"],
      _count: { id: true },
      where: { memberId },
      orderBy: { purchasedAt: "asc" },
    });

    const clicksOverTime = await prisma.clickEvent.groupBy({
      by: ["date"],
      _sum: { count: true },
      where: { memberId },
      orderBy: { date: "asc" },
    });

    const memberProductStats = await prisma.saleEvent.groupBy({
      by: ["campaignProductId"],
      _count: { id: true },
      _sum: { salePrice: true },
      where: { memberId },
    });

    const products = await prisma.campaignProduct.findMany({
      where: {
        id: { in: memberProductStats.map((p) => p.campaignProductId) },
      },
      include: { product: true },
    });

    const topProducts = memberProductStats
      .map((p) => ({
        productId: p.campaignProductId,
        name:
          products.find((x) => x.id === p.campaignProductId)?.product.name ??
          "Unknown Product",
        sales: p._count.id,
        revenue: p._sum.salePrice ?? 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    const platformClicks = await prisma.clickEvent.groupBy({
      by: ["platform"],
      _sum: { count: true },
      where: { memberId },
    });

    const platformSales = await prisma.saleEvent.groupBy({
      by: ["platform"],
      _count: { id: true },
      where: { memberId },
    });

    const topPlatforms = {
      clicks: platformClicks
        .map((p) => ({ platform: p.platform, clicks: p._sum.count ?? 0 }))
        .sort((a, b) => b.clicks - a.clicks),
      sales: platformSales
        .map((p) => ({ platform: p.platform, sales: p._count.id ?? 0 }))
        .sort((a, b) => b.sales - a.sales),
    };

    let payout = 0;

    if (campaign.payoutModel === "CPS" || campaign.payoutModel === "BOTH") {
      if (campaign.cpsCommissionType === "PERCENTAGE") {
        payout += (campaign.cpsValue / 100) * totalRevenue;
      } else {
        payout += salesCount * campaign.cpsValue;
      }
    }

    if (campaign.payoutModel === "CPC" || campaign.payoutModel === "BOTH") {
      payout += totalClicks * (campaign.cpcValue ?? 0);
    }

    return {
      success: true,
      data: {
        sales: salesCount,
        clicks: totalClicks,
        revenue: totalRevenue,
        conversionRate,
        salesOverTime,
        clicksOverTime,
        topProducts,
        topPlatforms,
        payout,
      },
    };
  })

});
