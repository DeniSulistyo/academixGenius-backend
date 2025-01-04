/*
  Warnings:

  - You are about to drop the column `date` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "date",
DROP COLUMN "end_time",
DROP COLUMN "start_time";
