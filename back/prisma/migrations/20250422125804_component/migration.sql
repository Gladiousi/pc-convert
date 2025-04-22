/*
  Warnings:

  - Made the column `socket` on table `Component` required. This step will fail if there are existing NULL values in that column.
  - Made the column `connector` on table `Component` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ramType` on table `Component` required. This step will fail if there are existing NULL values in that column.
  - Made the column `interface` on table `Component` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gpuConnector` on table `Component` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Component" ALTER COLUMN "socket" SET NOT NULL,
ALTER COLUMN "connector" SET NOT NULL,
ALTER COLUMN "ramType" SET NOT NULL,
ALTER COLUMN "interface" SET NOT NULL,
ALTER COLUMN "gpuConnector" SET NOT NULL;
