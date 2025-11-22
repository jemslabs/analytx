import { CreatorNiche, IndustryCategory, PlatformType } from '@/lib/generated/prisma/client/enums';
import {z} from 'zod'

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