/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio";
