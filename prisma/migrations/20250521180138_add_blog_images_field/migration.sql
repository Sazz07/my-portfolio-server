/*
  Warnings:

  - You are about to drop the column `image` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "image";
