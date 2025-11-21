import { CreatorNiche, PlatformType } from "@prisma/client";
import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { generateUniqueCreatorSlug } from "@/server/utils/slugify";

const createCreatorProfileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  niche: z.nativeEnum(CreatorNiche),
});

const updateCreatorProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  niche: z.nativeEnum(CreatorNiche).optional(),
});

const addCreatorPlatform = z.object({
  platform: z.nativeEnum(PlatformType),
  username: z.string(),
  url: z.url(),
  followers: z.number(),
});
export const creatorProfileRouter = router({
  create: publicProcedure
    .input(createCreatorProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;

        if (!userId) {
          return {
            success: false,
            message: "Unauthorized",
          };
        }

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
            message: "Only creators can create a brand profile.",
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

  update: publicProcedure
    .input(updateCreatorProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;

        if (!userId) {
          return {
            success: false,
            message: "Unauthorized",
          };
        }

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

  addPlatform: publicProcedure
    .input(addCreatorPlatform)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;

        if (!userId) {
          return {
            success: false,
            message: "Unauthorized",
          };
        }

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

  deletePlatform: publicProcedure
    .input(
      z.object({
        platformId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;

        if (!userId) {
          return {
            success: false,
            message: "Unauthorized",
          };
        }

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
