-- CreateEnum
CREATE TYPE "RequirementGroupType" AS ENUM ('GROUP_CERTIFICATION', 'INDIVIDUAL_CERTIFICATION');

-- AlterTable
ALTER TABLE "RequirementGroup" ADD COLUMN     "type" "RequirementGroupType" NOT NULL DEFAULT 'GROUP_CERTIFICATION';
