/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SectionToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `diseaseId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `themeId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "_SectionToUser" DROP CONSTRAINT "_SectionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SectionToUser" DROP CONSTRAINT "_SectionToUser_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "sectionId",
ADD COLUMN     "diseaseId" INTEGER NOT NULL,
ADD COLUMN     "themeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Section";

-- DropTable
DROP TABLE "_SectionToUser";

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "guidelines" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DiseaseToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_name_key" ON "Disease"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DiseaseToUser_AB_unique" ON "_DiseaseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DiseaseToUser_B_index" ON "_DiseaseToUser"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiseaseToUser" ADD CONSTRAINT "_DiseaseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Disease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiseaseToUser" ADD CONSTRAINT "_DiseaseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
