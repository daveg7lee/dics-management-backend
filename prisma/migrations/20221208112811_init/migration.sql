-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Student', 'Admin');

-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('Demerit', 'Merit');

-- CreateEnum
CREATE TYPE "GradeType" AS ENUM ('G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12');

-- CreateEnum
CREATE TYPE "SuggestType" AS ENUM ('School', 'Dorm', 'Other');

-- CreateEnum
CREATE TYPE "SuggestStatus" AS ENUM ('waiting', 'processing', 'done', 'decline');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/du4erd9mp/image/upload/v1609642686/User%20Profile/%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-removebg-preview_1_qenllx.png',
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "grade" "GradeType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "article" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ScoreType" NOT NULL,
    "date" TEXT NOT NULL,
    "uploader" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suggest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SuggestType" NOT NULL,
    "reply" TEXT,
    "status" "SuggestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suggest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suggest" ADD CONSTRAINT "Suggest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
