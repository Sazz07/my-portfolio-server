/*
  Warnings:

  - You are about to drop the column `profileId` on the `contacts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_profileId_fkey";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "profileId";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phoneNumber" TEXT;
