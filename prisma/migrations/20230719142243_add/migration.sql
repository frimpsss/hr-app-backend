/*
  Warnings:

  - Added the required column `status` to the `Leave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "status" TEXT NOT NULL;
