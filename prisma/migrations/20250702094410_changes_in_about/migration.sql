/*
  Warnings:

  - You are about to drop the column `achievements` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `introduction` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `servicesOffered` on the `about` table. All the data in the column will be lost.
  - You are about to drop the column `toolsAndTech` on the `about` table. All the data in the column will be lost.
  - Added the required column `approach` to the `about` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beyondCoding` to the `about` table without a default value. This is not possible if the table is not empty.
  - Added the required column `journey` to the `about` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lookingForward` to the `about` table without a default value. This is not possible if the table is not empty.
  - Added the required column `values` to the `about` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "about" DROP COLUMN "achievements",
DROP COLUMN "introduction",
DROP COLUMN "overview",
DROP COLUMN "servicesOffered",
DROP COLUMN "toolsAndTech",
ADD COLUMN     "approach" TEXT NOT NULL,
ADD COLUMN     "beyondCoding" TEXT NOT NULL,
ADD COLUMN     "journey" TEXT NOT NULL,
ADD COLUMN     "lookingForward" TEXT NOT NULL,
ADD COLUMN     "values" TEXT NOT NULL;
