-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequirementGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "number" INTEGER NOT NULL,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequirementSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementChapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequirementChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RequirementToGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RequirementToGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Requirement_number_key" ON "Requirement"("number");

-- CreateIndex
CREATE UNIQUE INDEX "RequirementGroup_name_key" ON "RequirementGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RequirementSection_number_key" ON "RequirementSection"("number");

-- CreateIndex
CREATE UNIQUE INDEX "RequirementChapter_number_key" ON "RequirementChapter"("number");

-- CreateIndex
CREATE INDEX "_RequirementToGroup_B_index" ON "_RequirementToGroup"("B");

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "RequirementSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementSection" ADD CONSTRAINT "RequirementSection_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "RequirementChapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequirementToGroup" ADD CONSTRAINT "_RequirementToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequirementToGroup" ADD CONSTRAINT "_RequirementToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "RequirementGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
