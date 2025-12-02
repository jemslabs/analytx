import { router } from "../trpc";
import { campaignRouter } from "./campaign/campaign.router";
import { productRouter } from "./product/product.router";
import { profileRouter } from "./profile/profile.router";


export const appRouter = router({
    profile: profileRouter,
    product: productRouter,
    campaign: campaignRouter
});

export type AppRouter = typeof appRouter;