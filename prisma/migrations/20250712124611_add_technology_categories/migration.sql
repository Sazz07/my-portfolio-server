/*
  Warnings:

  - Added the required column `categoryId` to the `technologies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technologies" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "technology_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technology_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "technology_categories_name_key" ON "technology_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "technology_categories_value_key" ON "technology_categories"("value");

-- AddForeignKey
ALTER TABLE "technologies" ADD CONSTRAINT "technologies_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "technology_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
