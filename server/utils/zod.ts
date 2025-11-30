import {
  CommissionType,
  CreatorNiche,
  IndustryCategory,
  PayoutModel,
  PlatformType,
  ProductStatus,
} from "@/lib/generated/prisma/client/enums";
import { z } from "zod";

export const createBrandProfile = z.object({
  name: z.string(),
  description: z.string(),
  industry: z.nativeEnum(IndustryCategory),
  websiteUrl: z.url(),
  contactEmail: z.email(),
});

export const updateBrandProfile = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  industry: z.nativeEnum(IndustryCategory).optional(),
  websiteUrl: z.url().optional(),
  contactEmail: z.email().optional(),
});

export const createCreatorProfileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  niche: z.nativeEnum(CreatorNiche),
});

export const updateCreatorProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  niche: z.nativeEnum(CreatorNiche).optional(),
});

export const addCreatorPlatform = z.object({
  platform: z.nativeEnum(PlatformType),
  username: z.string(),
  url: z.url(),
  followers: z.number(),
});

export const createProductSchema = z.object({
  name: z.string(),
  basePrice: z.number().positive(),
  skuId: z.string(),
  productUrl: z.url(),
});

export const updateProductSchema = z.object({
  productId: z.number(),
  name: z.string().optional(),
  basePrice: z.number().positive().optional(),
  productUrl: z.url().optional(),
  status: z.nativeEnum(ProductStatus),
});

export const createCampaignSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  redirectUrl: z.url(),
  payoutModel: z.nativeEnum(PayoutModel),
  cpsCommissionType: z.nativeEnum(CommissionType),
  cpsValue: z.number(),
  cpcValue: z.number(),
});

export const updateCampaignSchema = z.object({
  campaignId: z.number(),
  redirectUrl: z.url().optional(),
});

export const addProductInCampaignSchema = z.object({
  productId: z.number(),
  campaignId: z.number()
})
export const removeProductFromCampaignSchema = z.object({
  campaignProductId: z.number(),
})

export const sendCampaignInviteSchema = z.object({
  campaignId: z.number(),
  email: z.email()
})

export const acceptCampaignInviteSchema = z.object({
  campaignInviteId: z.number()
})

export const createReferralCodeSchema = z.object({
  campaignMemberId: z.number(),
  platform: z.nativeEnum(PlatformType)
})


export const startCampaignSchema = z.object({
  campaignId: z.number()
})

export const completeCampaignSchema = z.object({
  campaignId: z.number()
})

