-- CreateEnum
CREATE TYPE "SuggestType" AS ENUM ('School', 'Dorm', 'Other');

-- CreateEnum
CREATE TYPE "SuggestStatus" AS ENUM ('waiting', 'processing', 'done');

-- CreateTable
CREATE TABLE "Suggest" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SuggestType" NOT NULL,
    "reply" TEXT NOT NULL,
    "status" "SuggestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suggest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Suggest" ADD CONSTRAINT "Suggest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
