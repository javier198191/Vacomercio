import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AnimalEstado, LotEstado } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async markAsSold(dto: CreateSaleDto) {
    const { animalId, loteId, vendedorId, compradorId, compradorTelefono, precio_final } = dto;

    if (!animalId && !loteId) {
      throw new BadRequestException('Debe especificar un animalId o un loteId para registrar la venta.');
    }

    // 1. Identify Comprador
    let finalCompradorId = compradorId;
    if (!finalCompradorId) {
      if (!compradorTelefono) {
        throw new BadRequestException('Debe proporcionar el ID del comprador o su número telefónico.');
      }
      // Look up user by phone number
      const buyer = await this.prisma.user.findFirst({
        where: { telefono: compradorTelefono },
      });
      if (!buyer) {
        throw new NotFoundException(`No se encontró un comprador registrado con el teléfono: ${compradorTelefono}`);
      }
      finalCompradorId = buyer.id;
    } else {
      // Verify comprador exists
      const buyer = await this.prisma.user.findUnique({
        where: { id: finalCompradorId },
      });
      if (!buyer) {
        throw new NotFoundException(`El comprador con ID ${finalCompradorId} no existe.`);
      }
    }

    if (vendedorId === finalCompradorId) {
      throw new BadRequestException('El vendedor y el comprador no pueden ser el mismo usuario.');
    }

    // 2. Perform updates based on what is being sold (individual or lote)
    return this.prisma.$transaction(async (tx) => {
      if (animalId) {
        // Individual animal sale
        const animal = await tx.animal.findUnique({
          where: { id: animalId },
        });

        if (!animal) {
          throw new NotFoundException(`El animal con ID ${animalId} no existe.`);
        }
        if (animal.userId !== vendedorId) {
          throw new BadRequestException('Este animal no le pertenece al vendedor especificado.');
        }
        if (animal.estado === AnimalEstado.VENDIDO) {
          throw new BadRequestException('Este animal ya ha sido vendido.');
        }

        // Set status to VENDIDO
        await tx.animal.update({
          where: { id: animalId },
          data: { estado: AnimalEstado.VENDIDO },
        });

        // If the animal was in a lot, check if the rest of the lot is also affected,
        // but typically individual sales happen for animals NOT in a lot (loteId is null).
      } else if (loteId) {
        // Lot sale
        const lot = await tx.lot.findUnique({
          where: { id: loteId },
          include: { animals: true },
        });

        if (!lot) {
          throw new NotFoundException(`El lote con ID ${loteId} no existe.`);
        }
        if (lot.userId !== vendedorId) {
          throw new BadRequestException('Este lote no le pertenece al vendedor especificado.');
        }
        if (lot.estado === LotEstado.VENDIDO) {
          throw new BadRequestException('Este lote ya ha sido vendido.');
        }

        // Set lot to VENDIDO
        await tx.lot.update({
          where: { id: loteId },
          data: { estado: LotEstado.VENDIDO },
        });

        // Set all animals in this lot to VENDIDO
        await tx.animal.updateMany({
          where: { loteId },
          data: { estado: AnimalEstado.VENDIDO },
        });
      }

      // 3. Create Sale Record
      return tx.sale.create({
        data: {
          animalId: animalId || null,
          loteId: loteId || null,
          vendedorId,
          compradorId: finalCompradorId!,
          precio_final,
          via_plataforma: true, // Marked as closed via platform confirmation
        },
        include: {
          animal: true,
          lot: true,
          vendedor: true,
          comprador: true,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        animal: true,
        lot: true,
        vendedor: true,
        comprador: true,
      },
    });
  }
}
