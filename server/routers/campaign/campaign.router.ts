import { createCampaignSchema, updateCampaignSchema } from "@/server/utils/zod";
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
            message: "You cannot update another brand’s campaign",
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
});
