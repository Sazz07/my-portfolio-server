-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "challenges" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "solutions" TEXT,
ADD COLUMN     "techStack" JSONB,
ADD COLUMN     "type" TEXT;
