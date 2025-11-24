import { createProductSchema, updateProductSchema } from "@/server/utils/zod";
import { router, brandProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const productRouter = router({
  createProduct: brandProcedure
    .input(createProductSchema)
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

        const { name, basePrice, productUrl, skuId } = input;

        await prisma.product.create({
          data: {
            brandId: brand.id,
            name,
            basePrice,
            skuId,
            productUrl,
          },
        });

        return { success: true, message: "Product created successfully" };
      } catch {
        return { success: false, message: "Internal server error" };
      }
    }),

  updateProduct: brandProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const prisma = ctx.prisma;
      const userId = ctx.userId;
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
      const { productId, status, basePrice, name, productUrl } = input;
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }
      if (product.brandId !== brand.id) {
        return {
          success: false,
          message: "You cannot edit another brand’s product",
        };
      }
      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          basePrice,
          name,
          status,
          productUrl,
        },
      });

      return {
        success: true,
        message: "Product updated successfully",
      };
    }),
});