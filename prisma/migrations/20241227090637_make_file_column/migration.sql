/*
  Warnings:

  - Added the required column `fileUrl` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "fileUrl" TEXT NOT NULL;
