/*
  Warnings:

  - You are about to drop the column `approved` on the `Leave` table. All the data in the column will be lost.
  - Added the required column `reviewed` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "approved",
ADD COLUMN     "reviewed" BOOLEAN NOT NULL;
