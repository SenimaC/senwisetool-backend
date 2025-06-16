-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('INITIAL', 'INTERNAL');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('BUILDING', 'DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "InspectionType" NOT NULL DEFAULT 'INITIAL',
    "activitySector" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "address" TEXT,
    "partnersLogos" TEXT[],
    "status" "InspectionStatus" NOT NULL DEFAULT 'BUILDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InspectionToRequirement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InspectionToRequirement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InspectionToRequirement_B_index" ON "_InspectionToRequirement"("B");

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InspectionToRequirement" ADD CONSTRAINT "_InspectionToRequirement_A_fkey" FOREIGN KEY ("A") REFERENCES "Inspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InspectionToRequirement" ADD CONSTRAINT "_InspectionToRequirement_B_fkey" FOREIGN KEY ("B") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
