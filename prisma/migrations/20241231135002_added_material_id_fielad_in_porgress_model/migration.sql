/*
  Warnings:

  - A unique constraint covering the columns `[userId,materialId]` on the table `Progres` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `materialId` to the `Progres` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Progres" ADD COLUMN     "materialId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Progres_userId_materialId_key" ON "Progres"("userId", "materialId");

-- AddForeignKey
ALTER TABLE "Progres" ADD CONSTRAINT "Progres_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
