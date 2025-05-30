/*
  Warnings:

  - You are about to drop the column `codeVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "codeVerified",
ADD COLUMN     "codeVerificationProcess" BOOLEAN NOT NULL DEFAULT false;
