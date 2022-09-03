-- CreateEnum
CREATE TYPE "GradeType" AS ENUM ('G7', 'G8', 'G9', 'G10', 'G11', 'G12');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "grade" "GradeType";
