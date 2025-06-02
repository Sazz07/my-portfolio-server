-- AlterTable
ALTER TABLE "about" ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "source" TEXT,
    "aboutId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "about"("id") ON DELETE CASCADE ON UPDATE CASCADE;
