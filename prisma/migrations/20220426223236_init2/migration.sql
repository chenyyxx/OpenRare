/*
  Warnings:

  - You are about to drop the column `JoinedAt` on the `SectionsOnUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SectionsOnUsers" DROP COLUMN "JoinedAt",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
