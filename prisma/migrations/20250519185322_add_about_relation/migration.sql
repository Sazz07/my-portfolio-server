-- CreateTable
CREATE TABLE "about" (
    "id" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "servicesOffered" TEXT[],
    "toolsAndTech" TEXT[],
    "achievements" TEXT[],
    "profileId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "about_profileId_key" ON "about"("profileId");

-- AddForeignKey
ALTER TABLE "about" ADD CONSTRAINT "about_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
