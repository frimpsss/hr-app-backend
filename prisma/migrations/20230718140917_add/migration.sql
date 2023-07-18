/*
  Warnings:

  - You are about to drop the column `departmentName` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `gender` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeName` to the `Leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "departmentName",
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "salary" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "employeeName" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL;
