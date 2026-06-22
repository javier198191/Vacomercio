-- CreateEnum
CREATE TYPE "UserTipo" AS ENUM ('GANADERO', 'COMPRADOR');

-- CreateEnum
CREATE TYPE "AnimalEstado" AS ENUM ('DISPONIBLE', 'EN_LOTE', 'VENDIDO');

-- CreateEnum
CREATE TYPE "LotEstado" AS ENUM ('DISPONIBLE', 'VENDIDO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "UserTipo" NOT NULL,
    "finca_nombre" TEXT,
    "departamento" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "reputacion_promedio" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "arete" TEXT NOT NULL,
    "raza" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL,
    "estado" "AnimalEstado" NOT NULL DEFAULT 'DISPONIBLE',
    "foto_url" TEXT,
    "userId" TEXT NOT NULL,
    "loteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "en_periodo_retiro" BOOLEAN NOT NULL DEFAULT false,
    "medicamento_retiro" TEXT,
    "fecha_limite_retiro" TIMESTAMP(3),

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "peso_total" DOUBLE PRECISION NOT NULL,
    "peso_promedio" DOUBLE PRECISION NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL,
    "estado" "LotEstado" NOT NULL DEFAULT 'DISPONIBLE',
    "foto_url" TEXT,
    "departamento" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "animalId" TEXT,
    "loteId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "animalId" TEXT,
    "loteId" TEXT,
    "vendedorId" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "precio_final" DECIMAL(12,2) NOT NULL,
    "via_plataforma" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "calificadorId" TEXT NOT NULL,
    "calificadoId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "estrellas" INTEGER NOT NULL,
    "criterio" TEXT NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_calificadorId_fkey" FOREIGN KEY ("calificadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_calificadoId_fkey" FOREIGN KEY ("calificadoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
