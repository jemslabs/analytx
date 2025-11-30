import {
  acceptCampaignInviteSchema,
  addProductInCampaignSchema,
  completeCampaignSchema,
  createCampaignSchema,
  createReferralCodeSchema,
  removeProductFromCampaignSchema,
  sendCampaignInviteSchema,
  startCampaignSchema,
  updateCampaignSchema,
} from "@/server/utils/zod";
import { router, brandProcedure, creatorProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { generateUniqueReferralCode } from "@/lib/tools";

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
          description,
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
            description,
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

        const { campaignId, redirectUrl } = input;
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
            message: "You do not have permission to modify this campaign.",
          });
        }

        await prisma.campaign.update({
          where: {
            id: campaign.id,
          },
          data: {
            redirectUrl,
          },
        });

        return { success: true, message: "Campaign Updated" };
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
  acceptCampaignInvite: creatorProcedure
    .input(acceptCampaignInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;

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
    }),

  createReferralCode: creatorProcedure
    .input(createReferralCodeSchema)
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
          message: "Referral code created",
          code,
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
});
