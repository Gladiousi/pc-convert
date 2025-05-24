-- DropIndex
DROP INDEX "Component_name_key";

-- AlterTable
ALTER TABLE "Component" ALTER COLUMN "socket" DROP NOT NULL,
ALTER COLUMN "connector" DROP NOT NULL,
ALTER COLUMN "ramType" DROP NOT NULL,
ALTER COLUMN "interface" DROP NOT NULL,
ALTER COLUMN "storageInterfaces" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "gpuConnector" DROP NOT NULL;
