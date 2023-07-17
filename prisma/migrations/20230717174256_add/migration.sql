/*
  Warnings:

  - You are about to drop the column `firsname` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "firsname",
ADD COLUMN     "firstname" TEXT NOT NULL;
