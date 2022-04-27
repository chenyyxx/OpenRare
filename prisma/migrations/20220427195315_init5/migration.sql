/*
  Warnings:

  - You are about to drop the `SectionsOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SectionsOnUsers" DROP CONSTRAINT "SectionsOnUsers_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "SectionsOnUsers" DROP CONSTRAINT "SectionsOnUsers_userId_fkey";

-- DropTable
DROP TABLE "SectionsOnUsers";

-- CreateTable
CREATE TABLE "_SectionToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SectionToUser_AB_unique" ON "_SectionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SectionToUser_B_index" ON "_SectionToUser"("B");

-- AddForeignKey
ALTER TABLE "_SectionToUser" ADD FOREIGN KEY ("A") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SectionToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
