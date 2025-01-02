/*
  Warnings:

  - You are about to drop the column `precentage` on the `Progres` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Progres" DROP COLUMN "precentage",
ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;
