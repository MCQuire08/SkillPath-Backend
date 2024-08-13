/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CourseCategory` DROP FOREIGN KEY `CourseCategory_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseCategory` DROP FOREIGN KEY `CourseCategory_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseLink` DROP FOREIGN KEY `CourseLink_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseLink` DROP FOREIGN KEY `CourseLink_linkId_fkey`;

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `link` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `CourseCategory`;

-- DropTable
DROP TABLE `CourseLink`;

-- DropTable
DROP TABLE `Link`;
