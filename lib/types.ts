import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type signupType = {
  email: String;
  password: String;
  role: String;
};

export type loginType = {
  email: String;
  password: String;
};

export type userType = {
  id: number;
  email: string;
  role: "BRAND" | "CREATOR";
  createdAt: Date;
  brandProfile: brandProfileType | null;
  creatorProfile: creatorProfileType | null;
};
export type brandProfileType = {
  id: number;
  createdAt: Date;
  name: string;
  userId: number;
  description: string | null;
  industry: IndustryCategoryType;
  websiteUrl: string | null;
  contactEmail: string | null;
  apiKey: string;
  updatedAt: Date | null;
  subscription: BrandSubscriptionType | null;
};
export type creatorProfileType = {
  id: number;
  createdAt: Date;
  name: string;
  userId: number;
  updatedAt: Date;
  bio: string | null;
  niche: CreatorNicheType;
};
export type BrandSubscriptionType = {
  id: number;
  brandId: number;
  plan: "BRAND_GROWTH";
  startedAt: Date;
  expiresAt: Date;
}
export type useAuthStoreType = {
  user: userType | null;
  isUserLoading: boolean;
  signup: (data: signupType, router: AppRouterInstance) => void;
  login: (data: loginType, router: AppRouterInstance) => void;
  logout: (router: AppRouterInstance) => void;
  setUser: (user: userType) => void;
  setIsUserLoading: (value: boolean) => void;
};

export type IndustryCategoryType =
  | "TECHNOLOGY"
  | "CONSUMER_GOODS"
  | "FOOD_AND_HEALTH"
  | "ENTERTAINMENT"
  | "TRAVEL_AND_HOSPITALITY"
  | "FINANCE"
  | "AUTOMOTIVE"
  | "EDUCATION"
  | "REAL_ESTATE"
  | "PARENTING"
  | "OTHER";

export type CreatorNicheType =
  | "FASHION"
  | "BEAUTY"
  | "TECH"
  | "GAMING"
  | "FITNESS"
  | "LIFESTYLE"
  | "FOOD"
  | "TRAVEL"
  | "EDUCATION"
  | "OTHER";

export type SalesOverTimeItem = {
  purchasedAt: string;
  _count?: { id?: number };
};

export type ClicksOverTimeItem = {
  date: string;
  _sum?: { count?: number };
};

export type CreatorStat = {
  creatorId: number;
  name: string;
  sales: number;
  clicks: number;
  revenue: number;
};

export type ProductStat = {
  productId: number;
  name: string;
  sales: number;
  revenue: number;
};
export type PlatformClicksStat = {
  name: string;
  platform: string;
  clicks: number;
};

export type PlatformSalesStat = {
  name: string;
  platform: string;
  sales: number;
};
export type TopCreators = {
  revenue: CreatorStat[];
  clicks: CreatorStat[];
  sales: CreatorStat[];
};

export type TopProducts = {
  revenue: ProductStat[];
  sales: ProductStat[];
};
export type TopPlatforms = {
  clicks: PlatformClicksStat[];
  sales: PlatformSalesStat[];
};
export type CreatorMetric = "revenue" | "clicks" | "sales";
export type ProductMetric = "revenue" | "sales";
export type PlatformMetric = "clicks" | "sales";
export type OverviewShape = {
  sales: number;
  clicks: number;
  revenue: number;
  conversionPercentage: number;
  creators: number;
  products: number;
  salesOverTime: SalesOverTimeItem[];
  clicksOverTime: ClicksOverTimeItem[];
  topCreators: TopCreators;
  topProducts: TopProducts;
  topPlatforms: TopPlatforms;
};
