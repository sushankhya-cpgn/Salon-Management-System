/*
  Warnings:

  - Added the required column `price` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('BOOKED', 'CANCELLED', 'COMPLETED', 'NOSHOW');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'BOOKED';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "UserSessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "refreshTokenHashed" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "UserSessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSessions_refreshTokenHashed_key" ON "UserSessions"("refreshTokenHashed");

-- CreateIndex
CREATE INDEX "UserSessions_userId_idx" ON "UserSessions"("userId");

-- AddForeignKey
ALTER TABLE "UserSessions" ADD CONSTRAINT "UserSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
