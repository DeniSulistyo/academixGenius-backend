/*
  Warnings:

  - Added the required column `userId` to the `Progres` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Progres" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Progres" ADD CONSTRAINT "Progres_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
