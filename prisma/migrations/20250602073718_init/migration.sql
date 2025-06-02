-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DEVELOPER', 'user', 'PDG', 'DG', 'ADG', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "AssistantRole" AS ENUM ('MENDATAIRE', 'AGENT', 'INSPECTOR', 'TRAINER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('REGISTERED', 'ACTIVE', 'DISABLED', 'DELETED', 'BANNED');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('BUILDING', 'PENDING', 'UNACTIVE', 'ACTIVE', 'BLOCKED', 'REJECTED', 'MAINTENANCE', 'CLOSE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'DG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "codeVerificationProcess" BOOLEAN NOT NULL DEFAULT false,
    "codeVerification" TEXT,
    "codeVerificationExpires" TIMESTAMP(3),
    "refreshToken" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'REGISTERED',
    "companyId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "authorization" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "address" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationCode" TEXT,
    "emailVerificationExpires" TIMESTAMP(3),
    "bucketName" TEXT,
    "status" "CompanyStatus" NOT NULL DEFAULT 'BUILDING',
    "onboardingSteps" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
