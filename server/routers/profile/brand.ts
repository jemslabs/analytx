import { IndustryCategory } from "@prisma/client";
import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { generateUniqueBrandSlug } from "@/server/utils/slugify";

const createBrandProfile = z.object({
  name: z.string(),
  description: z.string(),
  industry: z.nativeEnum(IndustryCategory),
  websiteUrl: z.url(),
  contactEmail: z.email(),
});

const updateBrandProfile = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  industry: z.nativeEnum(IndustryCategory).optional(),
  websiteUrl: z.url().optional(),
  contactEmail: z.email().optional(),
});

export const brandProfileRouter = router({
  create: publicProcedure
    .input(createBrandProfile)
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
  update: publicProcedure
    .input(updateBrandProfile)
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
});
