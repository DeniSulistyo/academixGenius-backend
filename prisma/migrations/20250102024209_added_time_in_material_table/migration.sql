-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "end_time" TEXT NOT NULL DEFAULT '23:59',
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "start_time" TEXT NOT NULL DEFAULT '00:00';