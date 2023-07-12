/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");
