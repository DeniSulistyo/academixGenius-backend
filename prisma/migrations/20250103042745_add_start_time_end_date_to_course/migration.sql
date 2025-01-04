-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "end_time" TEXT NOT NULL DEFAULT '23:59',
ADD COLUMN     "start_time" TEXT NOT NULL DEFAULT '00:00';
