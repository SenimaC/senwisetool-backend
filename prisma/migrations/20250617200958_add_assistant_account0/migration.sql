-- CreateEnum
CREATE TYPE "AssistantAccountStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DISABLED');

-- CreateTable
CREATE TABLE "AssistantAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AssistantRole" NOT NULL,
    "phoneNumber" TEXT,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AssistantAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssistantAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssistantAccount_email_key" ON "AssistantAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AssistantAccount_userId_key" ON "AssistantAccount"("userId");

-- AddForeignKey
ALTER TABLE "AssistantAccount" ADD CONSTRAINT "AssistantAccount_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantAccount" ADD CONSTRAINT "AssistantAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
