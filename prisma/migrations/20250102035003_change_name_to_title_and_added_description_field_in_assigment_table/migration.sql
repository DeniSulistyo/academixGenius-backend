/*
  Warnings:

  - You are about to drop the column `name` on the `Assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'No Description',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'No Title';
