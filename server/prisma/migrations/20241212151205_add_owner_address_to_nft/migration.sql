/*
  Warnings:

  - You are about to drop the column `ownerId` on the `NFT` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerAddress]` on the table `NFT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerAddress` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_ownerId_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "NFT" DROP COLUMN "ownerId",
ADD COLUMN     "ownerAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NFT_ownerAddress_key" ON "NFT"("ownerAddress");

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_ownerAddress_fkey" FOREIGN KEY ("ownerAddress") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
