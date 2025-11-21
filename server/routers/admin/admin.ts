import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
export const adminRouter = router({
  verifyBrand: publicProcedure
    .input(
      z.object({
        brandId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const prisma = ctx.prisma;
        const userId = ctx.userId;

        if (!userId) {
          return {
            success: false,
            message: "Unauthorized",
          };
        }
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) {
          return {
            success: false,
            message: "User not found.",
          };
        }

        if (user.role !== "ADMIN") {
          return {
            success: false,
            message: "Only admins can verify a brand.",
          };
        }

        const { brandId } = input;

        const brand = await prisma.brandProfile.findUnique({
          where: {
            id: brandId,
          },
        });
        if (!brand) {
          return {
            success: false,
            message: "Brand not found.",
          };
        }
        if (brand.verified) {
          return {
            success: false,
            message: "Brand is already verified",
          };
        }

        await prisma.brandProfile.update({
          where: {
            id: brand.id,
          },
          data: {
            verified: true,
          },
        });

        return {
          success: true,
          message: "Brand Verified",
        };
      } catch {
        return { success: false, message: "Internal server error" };
      }
    }),
});
