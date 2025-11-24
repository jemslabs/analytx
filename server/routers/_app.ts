import { router } from "../trpc";
import { adminRouter } from "./admin/admin.router";
import { productRouter } from "./product/product.router";
import { profileRouter } from "./profile/profile.router";


export const appRouter = router({
    profile: profileRouter,
    admin: adminRouter,
    product: productRouter
});

export type AppRouter = typeof appRouter;