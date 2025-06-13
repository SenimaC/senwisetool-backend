-- CreateEnum
CREATE TYPE "SourceSecure" AS ENUM ('SYSTEM', 'EXTERNAL');

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "from" "SourceSecure" NOT NULL DEFAULT 'EXTERNAL';

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "from" "SourceSecure" NOT NULL DEFAULT 'EXTERNAL';
