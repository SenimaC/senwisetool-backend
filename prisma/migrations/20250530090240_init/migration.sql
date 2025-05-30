/*
  Warnings:

  - The values [BUILDING,ARCHIVED] on the enum `CompanyStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `emailVerified` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationExpires` on the `User` table. All the data in the column will be lost.
  - Added the required column `authorization` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Made the column `logo` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AssistantRole" AS ENUM ('MENDATAIRE', 'AGENT', 'INSPECTOR', 'TRAINER');

-- AlterEnum
BEGIN;
CREATE TYPE "CompanyStatus_new" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'BLOCKED', 'REJECTED', 'MAINTENANCE', 'CLOSE');
ALTER TABLE "Company" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Company" ALTER COLUMN "status" TYPE "CompanyStatus_new" USING ("status"::text::"CompanyStatus_new");
ALTER TYPE "CompanyStatus" RENAME TO "CompanyStatus_old";
ALTER TYPE "CompanyStatus_new" RENAME TO "CompanyStatus";
DROP TYPE "CompanyStatus_old";
ALTER TABLE "Company" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('DEVELOPER', 'OWNER', 'PDG', 'DG', 'ADG', 'ASSISTANT');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DG';
COMMIT;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "emailVerified",
ADD COLUMN     "authorization" TEXT NOT NULL,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "logo" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerificationCode",
DROP COLUMN "emailVerificationExpires",
ADD COLUMN     "codeVerification" TEXT,
ADD COLUMN     "codeVerificationExpires" TIMESTAMP(3),
ADD COLUMN     "codeVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" SET DEFAULT 'DG',
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'REGISTERED';

-- DropEnum
DROP TYPE "AccountRole";
