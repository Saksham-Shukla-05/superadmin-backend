/*
  Warnings:

  - You are about to drop the column `actorUserId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `targetType` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `entity` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `performedBy` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_actorUserId_fkey";

-- AlterTable
ALTER TABLE "public"."AuditLog" DROP COLUMN "actorUserId",
DROP COLUMN "details",
DROP COLUMN "targetId",
DROP COLUMN "targetType",
DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entity" TEXT NOT NULL,
ADD COLUMN     "entityId" INTEGER NOT NULL,
ADD COLUMN     "performedBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
