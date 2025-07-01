/*
  Warnings:

  - Added the required column `categoryId` to the `skills` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "featuredImage" TEXT;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "skill_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skill_categories_name_key" ON "skill_categories"("name");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "skill_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
