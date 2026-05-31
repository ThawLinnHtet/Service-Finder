-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'PROVIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('CLEANING_SERVICES', 'REPAIR_SERVICES', 'BUILDING_SERVICES', 'EDUCATION', 'ELECTRICAL_SERVICES', 'MOVING_SERVICES');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "city" TEXT NOT NULL,
    "township" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "skills" TEXT[],
    "about" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "serviceAreas" TEXT[],
    "nrcState" TEXT NOT NULL,
    "nrcTownship" TEXT NOT NULL,
    "nrcNumber" TEXT NOT NULL,
    "status" "ProviderStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "ratingAverage" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderDocument" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "nrcFrontUrl" TEXT NOT NULL,
    "nrcBackUrl" TEXT NOT NULL,
    "selfiePhotoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_township_idx" ON "User"("township");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_userId_key" ON "ProviderProfile"("userId");

-- CreateIndex
CREATE INDEX "ProviderProfile_category_idx" ON "ProviderProfile"("category");

-- CreateIndex
CREATE INDEX "ProviderProfile_status_idx" ON "ProviderProfile"("status");

-- CreateIndex
CREATE INDEX "ProviderProfile_price_idx" ON "ProviderProfile"("price");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderDocument_providerId_key" ON "ProviderDocument"("providerId");

-- CreateIndex
CREATE INDEX "Service_providerId_idx" ON "Service"("providerId");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE INDEX "Service_price_idx" ON "Service"("price");

-- CreateIndex
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderDocument" ADD CONSTRAINT "ProviderDocument_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
