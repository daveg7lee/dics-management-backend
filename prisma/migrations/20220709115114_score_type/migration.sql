/*
  Warnings:

  - Changed the type of `type` on the `Score` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('Demerit', 'Merit');

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "type",
ADD COLUMN     "type" "ScoreType" NOT NULL;
