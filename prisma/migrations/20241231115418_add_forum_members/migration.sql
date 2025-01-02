/*
  Warnings:

  - You are about to drop the column `members` on the `Forum` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Forum" DROP COLUMN "members";

-- CreateTable
CREATE TABLE "_ForumMembers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ForumMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ForumMembers_B_index" ON "_ForumMembers"("B");

-- AddForeignKey
ALTER TABLE "_ForumMembers" ADD CONSTRAINT "_ForumMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Forum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ForumMembers" ADD CONSTRAINT "_ForumMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
