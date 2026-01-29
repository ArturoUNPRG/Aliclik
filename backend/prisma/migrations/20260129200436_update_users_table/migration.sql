/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `avatar` LONGTEXT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
