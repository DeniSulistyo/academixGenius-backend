/*
  Warnings:

  - You are about to drop the column `end_date` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Assignment` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "grade" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
