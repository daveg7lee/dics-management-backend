/*
  Warnings:

  - You are about to drop the column `reply` on the `Suggest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Suggest" DROP COLUMN "reply";

-- CreateTable
CREATE TABLE "Reply" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "suggestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_suggestId_fkey" FOREIGN KEY ("suggestId") REFERENCES "Suggest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
