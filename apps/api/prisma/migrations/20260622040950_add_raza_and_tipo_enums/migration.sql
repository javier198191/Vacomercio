/*
  Warnings:

  - Added the required column `tipo` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `raza` on the `Animal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AnimalRaza" AS ENUM ('BRAHMAN', 'GYR', 'ANGUS', 'CEBU', 'CRUZADO', 'NELORE', 'SIMMENTAL');

-- CreateEnum
CREATE TYPE "AnimalTipo" AS ENUM ('NOVILLO', 'VACA', 'TORO');

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "tipo" "AnimalTipo" NOT NULL,
DROP COLUMN "raza",
ADD COLUMN     "raza" "AnimalRaza" NOT NULL;
