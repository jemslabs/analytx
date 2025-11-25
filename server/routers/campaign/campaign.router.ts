import {
  addProductInCampaignSchema,
  createCampaignSchema,
  updateCampaignSchema,
} from "@/server/utils/zod";
import { router, brandProcedure, creatorProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

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

        const { name, description, startDate, endDate, redirectUrl } = input;

        await prisma.campaign.create({
          data: {
            brandId: brand.id,
            name,
            description,
            startDate,
            endDate,
            redirectUrl,
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

        const { campaignId, endDate, redirectUrl } = input;
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
            endDate,
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
});
