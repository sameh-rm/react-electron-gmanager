/*
  Warnings:

  - You are about to drop the column `userId` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the `PlanWorkouts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPermissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlanWorkouts" DROP CONSTRAINT "PlanWorkouts_planId_fkey";

-- DropForeignKey
ALTER TABLE "PlanWorkouts" DROP CONSTRAINT "PlanWorkouts_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermissions" DROP CONSTRAINT "UserPermissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermissions" DROP CONSTRAINT "UserPermissions_userId_fkey";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "userId";

-- DropTable
DROP TABLE "PlanWorkouts";

-- DropTable
DROP TABLE "UserPermissions";

-- CreateTable
CREATE TABLE "_PermissionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PlanToWorkout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToUser_AB_unique" ON "_PermissionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToUser_B_index" ON "_PermissionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlanToWorkout_AB_unique" ON "_PlanToWorkout"("A", "B");

-- CreateIndex
CREATE INDEX "_PlanToWorkout_B_index" ON "_PlanToWorkout"("B");

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD CONSTRAINT "_PermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD CONSTRAINT "_PermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanToWorkout" ADD CONSTRAINT "_PlanToWorkout_A_fkey" FOREIGN KEY ("A") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanToWorkout" ADD CONSTRAINT "_PlanToWorkout_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
