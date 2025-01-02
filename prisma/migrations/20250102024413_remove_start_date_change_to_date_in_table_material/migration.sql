/*
  Warnings:

  - You are about to drop the column `start_date` on the `Material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "start_date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
