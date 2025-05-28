-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('REGISTERED', 'ACTIVE', 'DISABLED', 'DELETED', 'BANNED');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('BUILDING', 'ACTIVE', 'BLOCKED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "logo" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "address" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationCode" TEXT,
    "emailVerificationExpires" TIMESTAMP(3),
    "bucketName" TEXT,
    "status" "CompanyStatus" NOT NULL DEFAULT 'BUILDING',
    "onboardingSteps" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
