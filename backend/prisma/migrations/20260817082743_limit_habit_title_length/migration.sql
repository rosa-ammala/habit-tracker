/*
  Warnings:

  - You are about to alter the column `title` on the `habit` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(80)`.

*/
-- AlterTable
ALTER TABLE `habit` MODIFY `title` VARCHAR(80) NOT NULL;
