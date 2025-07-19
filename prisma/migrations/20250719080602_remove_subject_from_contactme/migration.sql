/*
  Warnings:

  - You are about to drop the column `subject` on the `contacts` table. All the data in the column will be lost.
  - Made the column `email` on table `contacts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "subject",
ALTER COLUMN "email" SET NOT NULL;
