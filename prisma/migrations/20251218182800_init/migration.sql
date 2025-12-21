-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BRAND', 'CREATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "IndustryCategory" AS ENUM ('TECHNOLOGY', 'CONSUMER_GOODS', 'FOOD_AND_HEALTH', 'ENTERTAINMENT', 'TRAVEL_AND_HOSPITALITY', 'FINANCE', 'AUTOMOTIVE', 'EDUCATION', 'REAL_ESTATE', 'PARENTING', 'OTHER');

-- CreateEnum
CREATE TYPE "CreatorNiche" AS ENUM ('FASHION', 'BEAUTY', 'TECH', 'GAMING', 'FITNESS', 'LIFESTYLE', 'FOOD', 'TRAVEL', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'X', 'LINKEDIN', 'FACEBOOK', 'WHATSAPP', 'TELEGRAM', 'WEBSITE');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "PayoutModel" AS ENUM ('CPS', 'CPC', 'BOTH');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('BRAND_GROWTH');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('RAZORPAY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "industry" "IndustryCategory" NOT NULL DEFAULT 'OTHER',
    "websiteUrl" TEXT,
    "contactEmail" TEXT,
    "apiKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "niche" "CreatorNiche" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "brandId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "skuId" TEXT NOT NULL,
    "productUrl" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "status" "ProductStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "brandId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "redirectUrl" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "payoutModel" "PayoutModel" NOT NULL DEFAULT 'BOTH',
    "cpsCommissionType" "CommissionType" NOT NULL,
    "cpsValue" DOUBLE PRECISION NOT NULL,
    "cpcValue" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignProduct" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "CampaignProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignInvite" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignMember" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleEvent" (
    "id" SERIAL NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "memberId" INTEGER NOT NULL,
    "campaignProductId" INTEGER NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandSubscription" (
    "id" SERIAL NOT NULL,
    "brandId" INTEGER NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'BRAND_GROWTH',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" SERIAL NOT NULL,
    "brandId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "provider" "PaymentProvider" NOT NULL DEFAULT 'RAZORPAY',
    "providerPaymentId" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_userId_key" ON "BrandProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_apiKey_key" ON "BrandProfile"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "CreatorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_brandId_skuId_key" ON "Product"("brandId", "skuId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignProduct_campaignId_productId_key" ON "CampaignProduct"("campaignId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignInvite_campaignId_email_key" ON "CampaignInvite"("campaignId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignMember_campaignId_creatorId_key" ON "CampaignMember"("campaignId", "creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_memberId_platform_key" ON "ReferralCode"("memberId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "ClickEvent_memberId_platform_date_key" ON "ClickEvent"("memberId", "platform", "date");

-- CreateIndex
CREATE UNIQUE INDEX "BrandSubscription_brandId_key" ON "BrandSubscription"("brandId");

-- CreateIndex
CREATE INDEX "BrandSubscription_brandId_idx" ON "BrandSubscription"("brandId");

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignProduct" ADD CONSTRAINT "CampaignProduct_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignProduct" ADD CONSTRAINT "CampaignProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignInvite" ADD CONSTRAINT "CampaignInvite_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignMember" ADD CONSTRAINT "CampaignMember_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignMember" ADD CONSTRAINT "CampaignMember_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "CampaignMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleEvent" ADD CONSTRAINT "SaleEvent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "CampaignMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleEvent" ADD CONSTRAINT "SaleEvent_campaignProductId_fkey" FOREIGN KEY ("campaignProductId") REFERENCES "CampaignProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickEvent" ADD CONSTRAINT "ClickEvent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "CampaignMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandSubscription" ADD CONSTRAINT "BrandSubscription_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
