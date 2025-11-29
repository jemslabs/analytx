import { router } from "../trpc";
import { adminRouter } from "./admin/admin.router";
import { campaignRouter } from "./campaign/campaign.router";
import { productRouter } from "./product/product.router";
import { profileRouter } from "./profile/profile.router";


export const appRouter = router({
    profile: profileRouter,
    admin: adminRouter,
    product: productRouter,
    campaign: campaignRouter
});

export type AppRouter = typeof appRouter;