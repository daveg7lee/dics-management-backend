-- DropForeignKey
ALTER TABLE "Suggest" DROP CONSTRAINT "Suggest_userId_fkey";

-- AddForeignKey
ALTER TABLE "Suggest" ADD CONSTRAINT "Suggest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
