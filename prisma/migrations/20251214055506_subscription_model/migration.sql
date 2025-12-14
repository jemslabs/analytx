-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('BRAND_GROWTH');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('RAZORPAY');

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
CREATE UNIQUE INDEX "BrandSubscription_brandId_key" ON "BrandSubscription"("brandId");

-- CreateIndex
CREATE INDEX "BrandSubscription_brandId_idx" ON "BrandSubscription"("brandId");

-- AddForeignKey
ALTER TABLE "BrandSubscription" ADD CONSTRAINT "BrandSubscription_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
