/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'DEVELOPER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('ADG', 'AGENT', 'INSPECTOR', 'TRAINER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMIN';
