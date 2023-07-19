/*
  Warnings:

  - You are about to drop the column `employeeName` on the `Leave` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "employeeName",
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
