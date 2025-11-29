import {
  addCreatorPlatform,
  createBrandProfile,
  createCreatorProfileSchema,
  updateBrandProfile,
  updateCreatorProfileSchema,
} from "@/server/utils/zod";
import { router, protectedProcedure, brandProcedure } from "../../trpc";
import {
  generateUniqueBrandSlug,
  generateUniqueCreatorSlug,
} from "@/server/utils/slugify";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { generateApiKey, hashApiKey } from "@/lib/tools";

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
        const slug = await generateUniqueBrandSlug(prisma, name);

        const existing = await prisma.brandProfile.findUnique({
          where: { userId },
        });

        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Brand profile already exists.",
          });
        }

        const rawApiKey = generateApiKey();
        const hashedApiKey = hashApiKey(rawApiKey);

        await prisma.brandProfile.create({
          data: {
            name,
            websiteUrl,
            industry,
            description,
            contactEmail,
            slug,
            userId: userId,
            apiKey: hashedApiKey,
          },
        });

        return {
          success: true,
          message: "Your brand profile is now set up.",
          apiKey: rawApiKey,
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

        let slug = existing.slug;
        if (
          input.name &&
          input.name.trim().toLowerCase() !== existing.name.trim().toLowerCase()
        ) {
          slug = await generateUniqueBrandSlug(prisma, input.name);
        }

        const updated = await prisma.brandProfile.update({
          where: { id: existing.id },
          data: {
            ...input,
            slug,
          },
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

        const slug = await generateUniqueCreatorSlug(prisma, name);

        const profile = await prisma.creatorProfile.create({
          data: {
            userId,
            name,
            slug,
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
        let slug = existing.slug;
        if (input.name && input.name !== existing.name) {
          slug = await generateUniqueCreatorSlug(prisma, input.name);
        }

        const updated = await prisma.creatorProfile.update({
          where: { id: existing.id },
          data: {
            ...input,
            slug,
          },
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

  addCreatorPlatform: protectedProcedure
    .input(addCreatorPlatform)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;
        const prisma = ctx.prisma;

        const creator = await prisma.creatorProfile.findUnique({
          where: {
            userId,
          },
        });

        if (!creator) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Creator profile not found.",
          });
        }
        const existing = await prisma.creatorPlatform.findFirst({
          where: {
            creatorId: creator.id,
            platform: input.platform,
          },
        });

        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You already added this platform.",
          });
        }
        await prisma.creatorPlatform.create({
          data: {
            creatorId: creator.id,
            username: input.username,
            followers: input.followers,
            platform: input.platform,
            url: input.url,
          },
        });
        return {
          success: true,
          message: "Added this platform.",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  deleteCreatorPlatform: protectedProcedure
    .input(
      z.object({
        platformId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;

        const prisma = ctx.prisma;

        const creator = await prisma.creatorProfile.findUnique({
          where: { userId },
        });

        if (!creator) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Creator profile not found.",
          });
        }

        const existing = await prisma.creatorPlatform.findFirst({
          where: {
            creatorId: creator.id,
            id: input.platformId,
          },
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "This platform is not added yet.",
          });
        }
        await prisma.creatorPlatform.delete({
          where: { id: existing.id },
        });

        return {
          success: true,
          message: "Platform removed.",
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  regenerateAPIKey: brandProcedure.mutation(async ({ ctx }) => {
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
});
