/*
  Warnings:

  - The `description` column on the `educations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `description` column on the `experiences` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "educations" DROP COLUMN "description",
ADD COLUMN     "description" TEXT[];

-- AlterTable
ALTER TABLE "experiences" DROP COLUMN "description",
ADD COLUMN     "description" TEXT[];
