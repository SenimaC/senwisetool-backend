/*
  Warnings:

  - You are about to drop the column `hashedRt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedRt",
DROP COLUMN "refresh_token",
ADD COLUMN     "refreshToken" TEXT;
