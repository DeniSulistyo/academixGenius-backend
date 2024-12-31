/*
  Warnings:

  - A unique constraint covering the columns `[userId,date,courseId]` on the table `Presence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Presence` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Presence` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PRESENT', 'PERMISSION', 'LATE', 'ABSENT');

-- AlterTable
ALTER TABLE "Presence" ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Presence_userId_date_courseId_key" ON "Presence"("userId", "date", "courseId");

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
