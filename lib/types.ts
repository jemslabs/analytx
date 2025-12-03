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
  slug: string;
  description: string | null;
  industry: IndustryCategoryType;
  websiteUrl: string | null;
  contactEmail: string | null;
  apiKey: string;
  updatedAt: Date | null;
};
export type creatorProfileType = {
  id: number;
  createdAt: Date;
  name: string;
  userId: number;
  slug: string;
  updatedAt: Date;
  bio: string | null;
  niche: CreatorNicheType;
};
export type useAuthStoreType = {
  user: userType | null;
  isUserLoading: boolean;
  signup: (data: signupType) => Promise<userType | null>;
  login: (data: loginType) => Promise<userType | null>;

  setUser: (user: userType) => void;
  setIsUserLoading: (value: boolean) => void
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
