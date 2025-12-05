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

        return { success: true, message: "Product added successfully" };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  updateProduct: brandProcedure
    .input(updateProductSchema)
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
        const { productId, status } = input;
        const product = await prisma.product.findUnique({
          where: {
            id: productId,
          },
        });
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }
        if (product.brandId !== brand.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You cannot edit another brand’s product",
          });
        }
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            status,
          },
        });

        return {
          success: true,
          message: "Product updated successfully",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getProducts: brandProcedure.query(async ({ ctx }) => {
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

      const products = await prisma.product.findMany({
        where: {
          brandId: brand.id,
        },
      });

      return { success: true, products: products };
    } catch (err) {
      if (err instanceof TRPCError) throw err;
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
