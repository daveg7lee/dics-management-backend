-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "files" TEXT[],
    "caption" TEXT,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);
