import {
  addCreatorPlatform,
  createBrandProfile,
  createCreatorProfileSchema,
  updateBrandProfile,
  updateCreatorProfileSchema,
} from "@/server/utils/zod";
import { router, protectedProcedure } from "../../trpc";
import {
  generateUniqueBrandSlug,
  generateUniqueCreatorSlug,
} from "@/server/utils/slugify";
import { z } from "zod";


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
          return {
            success: false,
            message: "User not found.",
          };
        }

        if (user.role !== "BRAND") {
          return {
            success: false,
            message: "Only brands can create a brand profile.",
          };
        }

        const { name, websiteUrl, industry, description, contactEmail } = input;
        const slug = await generateUniqueBrandSlug(prisma, name);

        const existing = await prisma.brandProfile.findUnique({
          where: { userId },
        });

        if (existing) {
          return {
            success: false,
            message: "Brand profile already exists.",
          };
        }

        const profile = await prisma.brandProfile.create({
          data: {
            name,
            websiteUrl,
            industry,
            description,
            contactEmail,
            slug,
            userId: userId,
          },
        });

        return {
          success: true,
          message: "Your brand profile is now set up.",
          data: profile,
        };
      } catch {
        return { success: false, message: "Internal server error" };
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
          return {
            success: false,
            message: "Brand profile not found",
          };
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
      } catch {
        return { success: false, message: "Internal server error" };
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
          return {
            success: false,
            message: "User not found.",
          };
        }

        if (user.role !== "CREATOR") {
          return {
            success: false,
            message: "Only creators can create a creator profile.",
          };
        }
        const existing = await prisma.creatorProfile.findUnique({
          where: { userId },
        });

        if (existing) {
          return {
            success: false,
            message: "A creator profile already exists for this account.",
          };
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
      } catch {
        return { success: false, message: "Internal server error" };
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
          return {
            success: false,
            message: "Creator profile not found.",
          };
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
      } catch {
        return { success: false, message: "Internal server error" };
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
          return {
            success: false,
            message: "Creator profile not found",
          };
        }
        const existing = await prisma.creatorPlatform.findFirst({
          where: {
            creatorId: creator.id,
            platform: input.platform,
          },
        });

        if (existing) {
          return {
            success: false,
            message: "You already added this platform.",
          };
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
      } catch {
        return { success: false, message: "Internal server error" };
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
          return {
            success: false,
            message: "Creator profile not found.",
          };
        }

        const existing = await prisma.creatorPlatform.findFirst({
          where: {
            creatorId: creator.id,
            id: input.platformId,
          },
        });

        if (!existing) {
          return {
            success: false,
            message: "This platform is not added yet.",
          };
        }
        await prisma.creatorPlatform.delete({
          where: { id: existing.id },
        });

        return {
          success: true,
          message: "Platform removed.",
        };
      } catch {
        return { success: false, message: "Internal server error" };
      }
    }),
});
