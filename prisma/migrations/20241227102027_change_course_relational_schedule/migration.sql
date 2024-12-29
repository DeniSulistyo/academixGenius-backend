/*
  Warnings:

  - You are about to drop the `_CourseToSchedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CourseToSchedule" DROP CONSTRAINT "_CourseToSchedule_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToSchedule" DROP CONSTRAINT "_CourseToSchedule_B_fkey";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CourseToSchedule";

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
