/*
  Warnings:

  - You are about to drop the column `challenges` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `longDescription` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `solutions` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "challenges",
DROP COLUMN "features",
DROP COLUMN "longDescription",
DROP COLUMN "role",
DROP COLUMN "solutions",
DROP COLUMN "technologies",
DROP COLUMN "type";
